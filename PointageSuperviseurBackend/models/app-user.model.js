const dbConn = require('../config/db.config')
const bcrypt = require('bcryptjs')

const AppUser = function(user){
    this.prenom = user.prenom
    this.nom = user.nom
    this.email = user.email
    this.role = user.role
    this.is_active = true
}

// get all users
AppUser.getAllUsers = (result) =>{
    dbConn.query('SELECT * FROM users', (err, res)=>{
        if(err){
            console.log('Error while fetching users', err);
            result(null,err);
        }else{
            console.log('Users fetched successfully');
            result(null,res);
        }
    })
}

// get all users by role
AppUser.getUsersByRole = (role, result) =>{
    dbConn.query('SELECT * FROM users WHERE role=?', role, (err, res)=>{
         if(err){
            console.log('Error while fetching users', err);
            result(null,err);
        }else{
            console.log('Users fetched successfully');
            result(null,res);
        }
    })
}

// get user by ID
AppUser.getUserByID = (id, result)=>{
    dbConn.query('SELECT * FROM users WHERE id=?', id, (err, res)=>{
        if(err){
            console.log('Error while fetching user by id', err);
            throw err
        }else{
            return result(null, res);
        }
    })
}

// get user by ID
AppUser.getUserByID1 = async(id)=>{
    const result = await dbConn.promise().query('SELECT * FROM users WHERE id=?', id)
    return result[0][0]
}


// get user by email
/*AppUser.getUserByEmail = (email, result)=>{
    dbConn.query('SELECT * FROM users WHERE email=?', email, (err, res)=>{
        if(err){
            console.log('Error while fetching user by email', err);
            result(null, err);
        }else{
            result(null, res);
        }
    })
}*/

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
AppUser.updateUser = (id, reqData, result)=>{
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