const jwt = require('jsonwebtoken')

module.exports = (req, res, secretKey) => {
    if (!req.headers.authorization) {
        console.log(req.headers.authorization)
        res.status(401).send({ "Unauthorized": "Authorization header missing" })
        return false
    }

    const token = req.headers.authorization.trim().slice(7)

    if (!token) {
        res.status(401).send({ "Unauthorized": "JWT token missing" })
        return false
    }

    let decodedObject
    try {
        console.log(token, secretKey)
        decodedObject = jwt.verify(token, secretKey)
    } catch (e) {
        console.log(e)
        res.status(401).send({ "Unauthorized": "JWT token malformed" })
        return false
    }

    return decodedObject
}