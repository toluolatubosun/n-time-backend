require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

// Import routes
const authRoutes = require('./routes/auth')
const spaceRoutes = require('./routes/space')

const app = express()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.PORT))
    .then((result) => console.log('Server is listening for requests'))
    .catch((error) => console.log(error))

// Middleware
app.use(express.json())

// Route Middleware
app.use('/api/user', authRoutes)
app.use('/api/space', spaceRoutes)
