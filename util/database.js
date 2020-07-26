const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'treez-order-service-api',
    password: 'root',
    multipleStatements: true,
});
/*
pool.connect((err)=>{
    if (err){
        throw err
    }
    console.log('DB connected!!')
    pool.query('CREATE DATABASE `OMS`',(err)=>{
        if (err) throw err
        console.log("Database created!!")
    })
})*/

module.exports= pool.promise()