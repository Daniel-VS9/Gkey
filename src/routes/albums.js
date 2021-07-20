const express = require('express');
const db = require('../database/mysqlDB');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const albums = await db.query('SELECT * FROM album');
        res.json(albums);
    } catch (error) {
        res.json(error);
    }
});

router.get('/byname/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const album = await db.query('SELECT * FROM album WHERE name LIKE ?', `%${name}%`)
        if (album.length > 0) {
            res.json({ album });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.json(error)
    }
});

router.get('/byartistname/:name', async (req, res) => {
    const {name} = req.params

    try {
        const albums = await db.query(
            `SELECT a.id, a.name, release_year, ar.name, youtube
            FROM album a JOIN artist ar ON a.artist_id = ar.id 
            HAVING ar.name LIKE ?`, `%${name}%`);
        res.json(albums)

    } catch (error) {
        res.json(error)
    }
})

router.post('/add', async (req, res) => {
    const { name, release_year, artistID } = req.body;
    const newAlbum = [name, release_year, artistID];

    try {
        await db.query('INSERT INTO album (name, release_year, artist_id) VALUES (?)', [newAlbum])
        res.sendStatus(201)
    } catch (error) {
        if(error.code === 'ER_BAD_NULL_ERROR') {
            res.sendStatus(400)
        } else {
            res.json(error)
        }
    }
})

module.exports = router;
