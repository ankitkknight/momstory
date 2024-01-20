const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');
require('dotenv').config();


const JWT_SECRET = `${process.env.JWT_SECRET1};${process.env.JWT_SECRET2}`;

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
}

//Create a User using: POST "/api/auth/signin". No login required 
router.post('/signin', [
    body('username', 'Enter  valid name').isLength({ min: 3 }),
    body('password', 'Enter a valid password').isLength({ min: 8 }),
], async (req, res) => {
    console.log(req.body);
    let success = false;
    // if there are errors then return bad requests
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // check whether user with this email exit
        let user = await User.findOne({ username: req.body.username });

        if (user) {
            return res.status(400).json({ success, error: "User already existed with this username" })
        }

        // hashing of password
        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);

        // create a new user
        user = await User.create({
            username: req.body.username,
            password: secPass
        })

        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

// create a login using :Post "/api/auth/login" login required
router.post('/login', [
    body('username', 'Enter correct username'),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    console.log(req.body);
    let success = false;
    // if there are errors then return bad requests
    const errors = validationResult(req);
    // // console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // destructuring req
    const { username, password } = req.body;

    try {
        // checking for correct email-id in database
        let user = await User.findOne({ username });
        if (!user) {
            // hashing of password
            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);

            // create a new user
            user = await User.create({
                username: req.body.username,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
            // return res.status(500).json({ success, error: "Invalid User credentials" });
        }

        // checking for correct password
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(500).json({ success, error: "Invalid User credentials" });
        }

        const data = {
            user: {
                id: user.id,
            },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

// fetching a logedin user data :Post "/api/auth/savedstory" login required
router.post('/savedstories', fetchUser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    }

    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

router.post("/googlesignup", async (req, res) => {
    let success = false;

    // destructuring req
    try {
        // const { username, password } = req.body;
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            // Create the user in the database
            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);

            // create a new user
            user = await User.create({
                username: req.body.username,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
        else {
            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});

router.post("/googlelogin", async (req, res) => {
    let success = false;

    // destructuring req
    try {
        // const { username, password } = req.body;
        let user = await User.findOne({ username: req.body.username });


        if (!user) {
            // Create the user in the database
            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);

            // create a new user
            user = await User.create({
                username: req.body.username,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        }
        else {
            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(authToken)
            // console.log(data)
            success = true;
            res.json({ success, authToken });
        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});

router.post("/facebooklogin", async (req, res) => {
    var success = false;
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);
            user = await user.create({
                username: req.body.username,
                password: secPass
            });

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            console.log(authToken);
            console.log(data);
            console.log("facebook");
            res.json({ success, authToken });

        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
})


module.exports = router;