const router = require('express').Router()
const Space = require('../model/Space')
const Member = require('../model/Member')
const verifyUser = require('../middleware/verifyUser')
const { createSpaceValidation, updateSpaceValidation, spaceValidation } = require('../utils/validation')
const uniqueGenerator = require('../utils/uniqueGenerator')

// Get particular space
router.post('/', verifyUser, async (req, res) => {
    // Validate Input
    const { error } = spaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if space exists
    const space = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !space ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space
    const member = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !member ) return res.status(400).json({ error: true, path: "user", message: "Access Denied. You are not in this space" })

    // Return Space Data
    res.json({success: true, data: space})
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
        memberCount: 1
    })

    // Save Space and Join Space as an admin
    try{
        const savedSpace = await space.save()
    
        const member = new Member({
            spaceCode: spaceCode,
            userId: req.user._id,
            role: 1
        })
        await member.save()
        
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
    const space = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !space ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space
    const member = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !member ) return res.status(400).json({ error: true, path: "user", message: "Access Denied. You are not in this space" })

    // Update in database
    try{
        await Space.updateOne({ spaceCode: req.body.spaceCode }, { ...req.body, memberCount: space.memberCount, date: new Date() } )
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
    const space = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !space ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is already in the space
    const exists = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( exists ) return res.status(400).json({ error: true, path: "user", message: "You are already in this space" })

    // Add user to the space and Increase Count
    const member = new Member({
        spaceCode: req.body.spaceCode,
        userId: req.user._id,
    })

    try{
        const savedMember = await member.save()
        await Space.updateOne({ spaceCode: req.body.spaceCode }, { $inc: { memberCount: 1 } } )
        res.json({"success": true, "data": savedMember})
    }catch(err){
        res.status(400).json({ error: true, path: "db", message:"Database Error", ...err})
    }
})

router.post('/delete-space', verifyUser, async (req, res) => {
    // Validate input
    const { error } = spaceValidation(req.body)
    if( error ) return res.status(400).json({ error: true, path: error.details[0].path[0], message: error.details[0].message })
    
    // Check if space exists
    const space = await Space.findOne({ spaceCode: req.body.spaceCode })
    if( !space ) return res.status(400).json({ error: true, path: "space", message: "This space does not exist" })

    // Check if user is in the space and is an admin
    const member = await Member.findOne({ spaceCode: req.body.spaceCode, userId: req.user._id })
    if( !member ) return res.status(400).json({ error: true, path: "user", message: "You are not in this space" })
    if( member.role != 1 ) return res.status(400).json({ error: true, path: "user", message: "You do not have admin permission in this space" })

    // Delete space and all members
    try{
        await Space.deleteOne({ spaceCode: req.body.spaceCode })
        await Member.deleteMany({ spaceCode: req.body.spaceCode })

        res.json({ success: true, message: "Space has been deleted" })
    }catch(err){
        res.status(400).json({ error: true, path: "db", message: "Database Error", data: err })
    }
})

module.exports = router