const router = require('express').Router()
const verifyUser = require('../middleware/verifyUser')
const User = require('../model/User')
const Space = require('../model/Space')
const Member = require('../model/Member')
const { spaceValidation } = require('../utils/validation')

// User Data
router.post('/', verifyUser, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    if( !user ) return res.status(400).json({ error: true, path: "db", message: req.user._id})

    res.json({ success: true, data: user })
})

// All users spaces
router.post('/my-spaces', verifyUser, async (req, res) => {
    const member = await Member.find({ userId: req.user._id })
    var data = new Array()
    
    for(let i = 0; i < member.length; i++){
        let space = await Space.findOne({ spaceCode: member[i].spaceCode })
        data.push({ space, member: member[i] })
    }

    res.json({ success: true, data })
})

// leave a spaces
router.post('/leave-spaces', verifyUser, async (req, res) => {
    // Validate input
    const { error } = spaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if space exists
    const space = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !space ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space
    const member = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !member ) return res.status(400).json({ error: true, path: "user", message: "You are not in this space" })

    // Leave the space and delete space if empty
    try{
        await Member.deleteOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
        if( space.memberCount == 1 ) await Space.deleteOne({ spaceCode: req.body.spaceCode })
        res.json({ success: true, message: "You are no longer in the space"})
    }catch(err){
        res.status(400).json({ error: true, path: "db", message: "Database Error", data: err })
    }
})

module.exports = router