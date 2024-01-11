var jwt = require('jsonwebtoken');
const JWT_SECRET = "asdfghjkl;234567";

const fetchUser = (req, res, next) => {
    // get user from the jwt token add it to req object
    const token = req.header("auth-token");
    console.log(token)
    if (!token) {
        res.status(401).send({ error: "Unauthorized access" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        consolo.log(data)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Unauthorized access" })
    }


}

module.exports = fetchUser;