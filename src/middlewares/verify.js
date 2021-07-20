const db = require('../database/mysqlDB')

async function verifyNewUser (req, res, next) {
    const {username} = req.body

    try {
        let user = await db.query('SELECT EXISTS (SELECT * FROM user WHERE username = ? LIMIT 1) AS result', username)
        user = user[0].result
        user == 0 ? next() : res.sendStatus(400)
    } catch (error) {
        res.json(error)
    }
}

module.exports = {verifyNewUser}