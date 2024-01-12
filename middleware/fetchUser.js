var jwt = require('jsonwebtoken');
require('dotenv').config();



const fetchUser = (req, res, next) => {
    // get user from the jwt token add it to req object
    const token = req.header("auth-token");
    const JWT_SECRET = `${process.env.JWT_SECRET1};${process.env.JWT_SECRET2}`;
    console.log(token)
    if (!token) {
        res.status(401).send({ error: "Unauthorized access" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data)
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error.message)
        res.status(401).send({ error: "Unauthorized access2" })
    }


}

module.exports = fetchUser;