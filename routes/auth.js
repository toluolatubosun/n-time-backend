const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { signupValidation, loginValidation } = require('../utils/validation')

// Sign Up
router.post('/sign-up', async (req, res) => {
    // Validate input
    const { error } = signupValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if email exists
    const emailExist = await User.findOne({email: req.body.email})
    if( emailExist ) return res.status(400).json({ error: true, path: "email", message: "Email is already registered" })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    
    // Save user to the database
    try{
        const savedUser = await user.save()
        res.json({success: true, data: savedUser})
    }catch(err){
        res.status(400).json({error: true, path: "db", message:"Database Error", ...err})
    }
})

// Login
router.post('/login', async (req, res) => {
    // validate user input
    const { error } = loginValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if email exists
    const user = await User.findOne({email: req.body.email})
    if( !user ) return res.status(400).json({ error: true, path: "email", message: "This Email does not exist" })

    // Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if( !validPassword ) return res.status(400).json({ error: true, path: "password", message: "Incorrect Password" })

    // Create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30 days' })
    res.header('auth-token', token).json({success: true, token: token })
})

module.exports = router