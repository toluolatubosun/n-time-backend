const router = require('express').Router()
const verify = require('../utils/verifyUser')

router.get('/', verify, (req, res) => {
    res.json({ space: "Super dope"})
})

module.exports = router