const router = require('express').Router()
const verifyUser = require('../utils/verifyUser')
const { createSpaceValidation, updateSpaceValidation, spaceValidation } = require('../utils/validation')
const uniqueGenerator = require('../utils/uniqueGenerator')
const Space = require('../model/Space')
const Member = require('../model/Member')

// Get particular space
router.post('/', verifyUser, async (req, res) => {
    // Validate Input
    const { error } = spaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if space exists
    var exists = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !exists ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space
    var exists = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !exists ) return res.status(400).json({ error: true, path: "user", message: "Access Denied. You are not in this space" })

    // Return Space Data
    res.json({success: true, data: exists})
})

router.post('/create-space', verifyUser, async (req, res) => {
    // Validate input
    const { error } = createSpaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Generate Space Code
    const spaceCode = uniqueGenerator()

    // Create Space
    const space = new Space({
        name: req.body.name,
        spaceCode: spaceCode,
        venue: req.body.venue,
    })

    // Save and Join Space
    try{
        const savedSpace = await space.save()
    
        const member = new Member({
            spaceCode: spaceCode,
            userId: req.user._id,
            role: 1
        })
        const savedMember = await member.save()

        res.json({success: true, data: savedSpace})
    }catch(err){
        res.status(400).json({error: true, path: "db", message:"Database Error", ...err})
    }

   
})

router.post('/update-space', verifyUser, async (req, res) => {
    // Validate input
    const { error } = updateSpaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
     
    // Check if space exists
    var exists = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !exists ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space
    var exists = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !exists ) return res.status(400).json({ error: true, path: "user", message: "Access Denied. You are not in this space" })

    // Update in database
    try{
        await Space.updateOne({ spaceCode: req.body.spaceCode }, { ...req.body, date: new Date() } )
        const updatedSpace = await Space.findOne({ spaceCode: req.body.spaceCode })
        res.json({success: true, data: updatedSpace})
    }catch(err){
        res.send(400).json({error: true, path: "db", message:"Database Error", ...err})
    }
    
})

router.post('/join-space', verifyUser, async (req, res) => {
    // Validate input
    const { error } = spaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if space exists
    var exists = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !exists ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is already in the space
    var exists = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( exists ) return res.status(400).json({ error: true, path: "user", message: "You are already in this space" })

    // Add user to the space
    const member = new Member({
        spaceCode: req.body.spaceCode,
        userId: req.user._id,
    })

    try{
        const savedMember = await member.save()
        res.json({"success": true, "data": savedMember})
    }catch(err){
        res.status(400).json({ error: true, path: "db", message:"Database Error", ...err})
    }
})

router.post('/my-spaces', verifyUser, async (req, res) => {
    // Get users spaces
    const member = await Member.find({ userId: req.user._id })
    var data = new Array()
    
    for(let i = 0; i < member.length; i++){
        let space = await Space.findOne({ spaceCode: member[i].spaceCode })
        data.push({ space, member: member[i] })
    }

    res.json({ success: true, data })
})

module.exports = router