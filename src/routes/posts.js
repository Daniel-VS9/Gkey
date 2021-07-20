const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)        
    } catch (error) {
        res.json(error)
    }
})

router.post('/add', async (req, res) => {
    const {body, hashtags} = req.body

    try {
        const newPost = new Post({body, hashtags})
        await newPost.save()
        // console.log(newPost)
        res.sendStatus(201)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

module.exports = router