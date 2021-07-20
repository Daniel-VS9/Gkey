const express = require('express')
const db = require('../database/mysqlDB')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const songs = await db.query('SELECT * FROM song');
        res.json(songs);
    } catch (error) {
        res.json(error);
    }
});

router.get('/byname/:name', async (req, res) => {
    const {name} = req.params

    try {
        const songs = await db.query('SELECT * FROM song WHERE name LIKE ?', `%${name}%`)
        if (songs.length > 0) {
            res.json(songs);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.json(error)
    }
})

router.get('/byid/:id', async (req, res) => {
    const {id} = req.params

    try {
        const song = await db.query('SELECT * FROM song WHERE id = ?', id)
        song[0] ? res.json(song) : res.sendStatus(404)
    } catch (error) {
        res.json(error)
    }
})

router.post('/add', async (req, res) => {
    const {name, albumID, artistID, youtube} = req.body
    const newSong = [name, albumID, artistID, youtube]

    try {
        await db.query('INSERT INTO song (name, album_id, artist_id, youtube) VALUES (?)', [newSong])
        res.sendStatus(201)
    } catch (error) {
        if(error.code === 'ER_BAD_NULL_ERROR') {
            res.sendStatus(400)
        } else {
            res.json(error)
        }
    }
})

router.delete('/byid/:id', async (req, res) => {
    const {id} = req.params

    try {
        const result = await db.query('DELETE FROM song WHERE id = ?', id)
        if (result.affectedRows > 0) {
            res.sendStatus(204)
        } else (
            res.sendStatus(404)
        )
        
    } catch (error) {
        res.json(error)
    }
})

module.exports = router