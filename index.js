const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
require('dotenv').config();
const bodyParser = require("body-parser");

var cookieParser = require('cookie-parser');

connectToMongo();

const app = express()
const port = 4000

app.use(cookieParser());
app.use(cors({
    origin: ["https://65a6ff183edb872f12282fb9--deluxe-tartufo-0034e3.netlify.app", "*"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
}))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/stories', require('./routes/stories'))

app.listen(port, () => {
    console.log(`Momstory backend listening on port ${port}`)
})

// exports.api = functions.https.onRequest(app);