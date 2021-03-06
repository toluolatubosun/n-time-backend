const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    spaceCode: {
        type: String,
        length: 8,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    // Role of 1 = Admin, 0 = Regular Member
    role: {
        type: Number,
        length: 1,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Member', memberSchema)