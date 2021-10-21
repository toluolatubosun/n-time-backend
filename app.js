require('dotenv').config()
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')

// Import routes
const authRoutes = require('./routes/auth')
const spaceRoutes = require('./routes/space')
const userRoutes = require('./routes/user')

const app = express()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.PORT))
    .then((result) => console.log('Server is listening for requests'))
    .catch((error) => console.log(error))

// Middleware
app.use(cors({
    origin: '*'
}));
app.use(express.json())

// Route Middleware
app.use('/api/auth', authRoutes)
app.use('/api/space', spaceRoutes)
app.use('/api/user', userRoutes)

// 404 Route
app.use('*', (req, res) => {
    res.status(404).json({ error: true, path: "route", message: "Invalid Route"})
})