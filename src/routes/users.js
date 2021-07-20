const express = require("express");
const bcrypt = require('bcrypt')
const db = require("../database/mysqlDB");
const { createToken, authorizeToken, authenticate } = require("../middlewares/auth");
const {verifyNewUser} = require('../middlewares/verify')
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await db.query("SELECT * FROM user");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

router.post('/login', authenticate , createToken, (req, res) => {
    res.json({ accessToken : req.token })
})

router.post("/register", verifyNewUser, async (req, res) => {
    const { username, pass } = req.body;
    
    try {
        // REVIEW const hashedPass = bcrypt.hash(pass, 10) // Short method
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(pass, salt);
        const newUser = [username, hashedPass];

        db.query('START TRANSACTION')
        await db.query("INSERT INTO user (username, pass) VALUES (?)", [newUser]);
        const userID = await db.query('SELECT id FROM user WHERE username = ?', username)
        await db.query('INSERT INTO pick (user_id, name) VALUES (?, ?)', [userID[0].id, `${username} picks`])
        db.query('COMMIT')
        res.sendStatus(201);

    } catch (error) {
        await db.query('ROLLBACK');
        if (error.code === 'ER_BAD_NULL_ERROR') {
            res.sendStatus(400);
        } else {
            console.log(json(error));
            res.sendStatus(500)
        }
    }
});

module.exports = router;