const express = require('express')
const db = require('../database/mysqlDB')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const picks = await db.query('SELECT * FROM pick')
        res.json(picks)
    } catch (error) {
        res.json(error)
    }
})


router.get('/my', async (req, res) => {
    const {userID} = req.user
    
    try {
        const picks = await db.query('SELECT id, name FROM pick WHERE user_id = ?', [`${userID}`])
        res.json(picks)
    } catch (error) {
        res.json(error)
    }
})

router.post('/add', async (req, res) => {
    const {name} = req.body
    const {userID} = req.user
    
    if (name == null) return res.sendStatus(400)

    try {
        await db.query('INSERT INTO pick (user_id, name) VALUES (?, ?)', [userID, name])
        res.sendStatus(201)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/byid/:id', async(req, res) => {
    const {id} = req.params
    const {userID} = req.user

    try {
        const result = await db.query('DELETE FROM pick WHERE id = ? AND user_id = ?', [id, userID])
        // console.log(result['affectedRows'])
        if(result['affectedRows'] == 0 ) {
            throw new Error('NF')
        }
        res.sendStatus(204)
    } catch (error) {
        (error.message == 'NF') ? res.sendStatus(400) : res.json(error)
    }
})

module.exports = router;