const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    image: String,
})

module.exports = mongoose.model('user', userSchema)