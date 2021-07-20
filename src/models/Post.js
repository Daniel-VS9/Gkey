const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    body : {
        type: String,
        required : true
    },
    hashtags : [String]
}, {
    timestamps: true
})

module.exports = model('Post', postSchema)