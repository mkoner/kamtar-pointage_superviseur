const mysql = require('mysql2');

const dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

dbConn.connect(function(error){
    if(error) throw error;
    console.log('Database Connected Successfully!!!');
})

module.exports = dbConn;