require('dotenv').config({path : '../../config/.env'})
const mysql = require('mysql');
const util = require('util')
const {MYSQLDB_HOST, MYSQLDB_NAME, MYSQLDB_KEY, MYSQLDB_USER} = process.env

// Create connection
const db = mysql.createConnection({
    host : MYSQLDB_HOST,
    user : MYSQLDB_USER, 
    password : MYSQLDB_KEY,
    database: MYSQLDB_NAME
})

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql connected...')
})

// db.query = util.promisify(db.query).bind(db)
const query = util.promisify(db.query).bind(db)

module.exports = {db, query}