const mongoose = require('mongoose')

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 6,
        max: 50,
        required: true
    },
    spaceCode: {
        type: String,
        length: 8,
        unique: true,
        required: true
    },
    memberCount: {
        type: Number,
        default: 0,
    },
    venue: {
        type: String,
        min: 6,
        max: 150,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    // 0 - Not Started, 1 - Started, 2 - Cancelled
    state: {
        type: Number,
        length: 1,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Space', spaceSchema)