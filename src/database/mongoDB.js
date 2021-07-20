const mongoose = require('mongoose')
require('dotenv').config('../../config/.env')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify: true,
            useCreateIndex: true
        })
        console.log(`MongoDB Connected to ${conn.connection.host}`)
    
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB