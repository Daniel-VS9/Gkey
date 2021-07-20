require('dotenv').config({path : '../config/.env'}) 
const db = require('../database/mysqlDB')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


function createToken(req, res, next) {
    const {username} = req.body
    
    if(username) {
        const user = {name : username, userID : req.userID}
        const accesToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        req.token = accesToken
        
        next()
    } else {
        res.senStatus(400)
    }
}

function authorizeToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    try {
        const result =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = result

        next()
    } catch (error) {
        res.sendStatus(403)
    }
 }

async function authenticate(req, res, next) {

    const {username, pass} = req.body

    try {
        const user = await db.query('SELECT username, pass, id FROM user WHERE username = ?', [username])
        
        // console.log(req.userID)

        if (!user[0]) throw new Error('upE');
        req.userID = user[0].id

        const access = await bcrypt.compare(pass, user[0].pass);

        if (access) next();
        else throw new Error('upE');
         
    } catch (error) {
        if (error && error.message == 'upE') {
            res.status(400).json({err : "user or password incorrect"})
        } else {
            res.sendStatus(500)
        }
    }
}


module.exports = {createToken, authorizeToken, authenticate}