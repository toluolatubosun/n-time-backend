const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    const token = req.header('auth-token')
    if( !token ) return res.status(401).json({ "error": true, "message": "access denied"})

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(error){
        res.status(400).json({ "error": true, "message": "Invalid token"})
    }

}

module.exports = verifyUser