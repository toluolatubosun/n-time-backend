const router = require('express').Router()
const verifyUser = require('../middleware/verifyUser')
const User = require('../model/User')
const Space = require('../model/Space')
const Member = require('../model/Member')

// User Data
router.post('/', verifyUser, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    if( !user ) return res.status(400).json({ error: true, path: "db", message: "User Not found"})

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

module.exports = router