const dbConn = require('../config/db.config')
const bcrypt = require('bcryptjs')

const AppUser = function(user){
    this.prenom = user.prenom
    this.nom = user.nom
    this.email = user.email
    this.role = user.role
    this.is_active = user.is_active
} 

// get all users
AppUser.getAllUsers = async() =>{
    const result = await dbConn.promise().query('SELECT * FROM users')
    return result[0]
}

// get all users by role
AppUser.getUsersByRole = async(role) =>{
    const result = await dbConn.promise().query('SELECT * FROM users WHERE role=?', [role])
    return result[0]
}

// get user by ID
AppUser.getUserByID = async(id)=>{
    const result = await dbConn.promise().query('SELECT * FROM users WHERE id=?', id)
    return result[0][0]
}


AppUser.getUserByEmail = async(email)=>{
    const result = await dbConn.promise().query('SELECT * FROM users WHERE email=?', email)
    return result[0][0]
}

// create new user
AppUser.createUser = (reqData, result) =>{
    dbConn.query('INSERT INTO users SET ? ', reqData, (err, res)=>{
        if(err){
            console.log('Error while inserting data');
            result(null, err);
        }else{
            console.log('user created successfully');
            result(null, res)
        }
    })
}

// update user
AppUser.updateUser = (id, reqData, result) => {
    console.log("Inside updateUser user model",reqData)
    reqData.update_date = new Date()
    dbConn.query("UPDATE users SET prenom=?, nom=?, email=?, role=?, update_date=?, is_active=? WHERE id = ?",
     [reqData.prenom, reqData.nom, reqData.email, reqData.role, reqData.update_date,reqData.is_active, id], (err, res)=>{
        if(err){
            console.log('Error while updating the user');
            result(null, err);
        }else{
            console.log("user updated successfully");
            result(null, res);
        }
    });
}

// update password
AppUser.updateUserPassword = (id, reqData, result)=>{
    dbConn.query("UPDATE users SET password=? WHERE id=?", [reqData.password, id], (err, res)=>{
        if(err){
            console.log('Error while updating the user password');
            result(null, err);
        }else{
            console.log("user password updated successfully");
            result(null, res);
        }
    });
}

// delete user
AppUser.deleteUser = (id, result)=>{
     dbConn.query('DELETE FROM users WHERE id=?', [id], (err, res)=>{
         if(err){
             console.log('Error while deleting the user');
             result(null, err);
         }else{
             result(null, res);
         }
     });
}

module.exports = AppUser