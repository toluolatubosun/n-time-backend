const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 70
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already registered"],
        min: 6,
        max: 70,
    }, 
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('User', userSchema)