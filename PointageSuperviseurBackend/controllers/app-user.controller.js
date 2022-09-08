const AppUserModel = require('../models/app-user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// get all User list
exports.getAllUsers = asyncHandler(async (req, res)=> {
    if (req.user.role == "Admin") {
        const users = await AppUserModel.getAllUsers()
        res.status(200).json(users)
    }
    else
    res.status(401).json({
        message: "You do not have enough permission"
    })
})

// get Superviseurs
exports.getSuperviseurs = async (req, res) => {
    if (req.user.role == "Manager" || req.user.role == "Admin") {
        const users = await AppUserModel.getUsersByRole("Superviseur")
        res.status(200).json(users)
    }
    else
    res.status(401).json({
        message: "You do not have enough permission"
    })
}

// get Manager
exports.getManagers = async (req, res) => {
    if (req.user.role == "Admin") {
        const users = await AppUserModel.getUsersByRole("Manager")
        res.status(200).json(users)
    }
    else
    res.status(401).json({
        message: "You do not have enough permission"
    })
}

// get Manager
exports.getAdmins = async (req, res) => {
    if (req.user.role == "Admin") {
        const users = await AppUserModel.getUsersByRole("Admin")
        res.status(200).json(users)
    }
    else
    res.status(401).json({
        message: "You do not have enough permission"
    })
}
 
// get User by ID
exports.getUserByID = asyncHandler(async (req, res) => {
    console.log("getUserByID in controller called")
    if(req.user.role == "Superviseur" && req.user.id != req.params.id)
    res.status(401).json({
        message: "You do not have enough permission"
    })
    else {
        const user = await AppUserModel.getUserByID(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error('No user with that id found')
        }
        res.status(200).json(user)
    }
})

exports.getUserByID1 = asyncHandler(async (req, res) => {
 
        const user = await AppUserModel.getUserByID(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error('No user with that id found')
        }
        res.status(200).json(user)
})

// create new User
exports.createNewUser = async (req, res) => {
    //if(req.user.role == "Manager" || req.user.role == "Admin"){
    AppUserModel.getUserByEmail(req.body.email, (err, user)=>{
        if(user.lenght > 0)
        res.status(400).json({
            success: false, 
            message: 'Email already exists'
        })
    })
    const userTocreate = new AppUserModel(req.body);
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    userTocreate.password = hashedPassword
    userTocreate.join_date = new Date()
    userTocreate.is_active = true
    console.log('userTocreate', userTocreate);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        AppUserModel.createUser(userTocreate, (err, user)=>{
            if(user.insertId)
            res.status(200).json({
                success: true, 
                message: 'User Created Successfully', 
                data: user.insertId})
            else
            res.status(500).json({
                success: false,
                message: "Error while creating User"
            })
        })
    } 
// }
    /*else
    res.status(401).json({
        message: "You do not have enough permission"
    })*/
}

// User login
exports.login = async (req, res) => {
    console.log("Login called")
    const { email, password } = req.body
    const user = await AppUserModel.getUserByEmail(email)

    if (user && (await bcrypt.compare(password, user.password) && user.is_active))
    {
        token = generateToken(user)
        res.set('token', token)
        user.token = token
        res.status(200).json(user)
    }else {
        res.status(400).json({
            message: "Invalid Credentials"
        })
      }
}

// update User
exports.updateUser = (req, res) => {
    console.log("Inside controller", req.body)
    if(req.user.role == "Superviseur" && req.user.id != req.params.id)
    res.status(401).json({
        message: "You do not have enough permission"
    })
    else {
    AppUserModel.getUserByEmail(req.body.email, (err, user)=>{
        if(user.lenght > 0 && user[0].id != req.params.id){
            res.status(400).json({
                success: false, 
                message: 'Email already exists'
            })
        }
    })
    const updatedUser = new AppUserModel(req.body);
    updatedUser.update_date = new Date()
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        AppUserModel.updateUser(req.params.id, updatedUser, (err, user)=>{
            if(err)
            res.status(500).json({
                message: "Error updating user"
            })
            res.status(200).json({success: true, message: 'User updated Successfully', data: user})
        })
    } }
}

// update password
exports.updateUserPassword = async(req, res)=>{
    if(req.user.role == "Superviseur" && req.user.id != req.params.id)
    res.status(401).json({
        message: "You do not have enough permission"
    })
    else {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    AppUserModel.updateUserPassword(req.params.id, hashedPassword, (err, user)=>{
        if(err)
        res.satus(500).json({
            message: "Error updating User password"
        })
        res.status(200).json({
            message: "Password updated"
        })
    })
}
}

// delete User
exports.deleteUser = (req, res)=>{
    if(req.user.role != "Admin")
    res.status(401).json({
        message: "You do not have enough permission"
    })
    else
    AppUserModel.deleteUser(req.params.id, (err, user)=>{
        if(err)
        res.status(500).json({
            message: "Error deleting user"
        })
        res.status(200).json({success:true, message: 'User deleted successully!'});
    })
}

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({
         id:user.id, 
         issuer: "Kamtar Pointage Superviseur",
         subject: "App-Users",
         role: user.role
        }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }