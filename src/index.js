const express = require('express')
require('dotenv').config({path : './config/.env'})
const connectDB = require('./database/mongoDB')
const { authorizeToken } = require('./middlewares/auth')
const app = express()

// Settings
const PORT = process.env.PORT || 5000
connectDB()

app.use(express.json())

// Routes
app.use('/', require('./routes/users'))
app.use( authorizeToken )
app.use('/users', require('./routes/users'))
app.use('/artists', require('./routes/artists'))
app.use('/albums', require('./routes/albums'))
app.use('/songs', require('./routes/songs'))
app.use('/picks', require('./routes/picks'))
app.use('/posts', require('./routes/posts'))

app.listen(PORT, console.log('Server runnig on port', PORT))