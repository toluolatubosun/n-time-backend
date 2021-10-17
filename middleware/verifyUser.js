const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    const token = req.header('auth-token')
    if( !token ) return res.status(401).json({ error: true, message: "Access denied. Authentication token not found"})

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(error){
        res.status(400).json({ error: true, message: "Invalid token. Please login"})
    }

}

module.exports = verifyUser