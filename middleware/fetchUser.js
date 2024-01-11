var jwt = require('jsonwebtoken');
require('dotenv').config();



const fetchUser = (req, res, next) => {
    // get user from the jwt token add it to req object
    const token = req.header("auth-token");
    console.log(token)
    if (!token) {
        res.status(401).send({ error: "Unauthorized access" })
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY || "asdfghjkl;234567");
        consolo.log(data)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Unauthorized access" })
    }


}

module.exports = fetchUser;