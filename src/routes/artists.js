const express = require('express');
const router = express.Router();
const db = require('../database/mysqlDB');

router.get('/', async (req, res) => {
    try {
        const artists = await db.query('SELECT * FROM artist');
        res.json(artists);
    } catch (error) {
        res.json({ error });
    }
});

router.post('/add', async (req, res) => {
    const {name} = req.body
    
    try {
        await db.query('INSERT INTO artist (name) VALUES(?)', name)
        res.sendStatus(201)
    } catch (error) {
        if(error.code === 'ER_BAD_NULL_ERROR') {
            res.sendStatus(400)
        } else {
            res.json(error)
        }
    }
});

module.exports = router;