const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 60
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already registered"],
        min: 6,
        max: 60,
    }, 
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('User', userSchema)