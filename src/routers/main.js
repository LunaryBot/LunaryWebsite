require("dotenv").config()
require("../strategy")
const express = require("express")
const path = require("path")
const passport = require("passport")
const app = express()
const session = require("express-session")
const firebase = require("firebase")

// Firebase Database

firebase.initializeApp(JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG_GUILDS, 'base64').toString('ascii')))
global.GuildsDB = firebase.database()
global.db = global.GuildsDB

const UsersDB = firebase.initializeApp(JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG_USERS, 'base64').toString('ascii')), "users")
global.UsersDB = UsersDB.database()
        
const LogsDB = firebase.initializeApp(JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG_LOGS, 'base64').toString('ascii')), "logs")
global.LogsDB = LogsDB.database()

// App set's & use's
app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 1 * 1000 * 60 * 60
    },
    saveUninitialized: false,
    name: 'lunary.dashboard'
}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../pages'));
app.use(express.static(path.join(__dirname, '../assets')))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/api", require("./api/main"))
app.use("/auth", require("./auth"))
app.use("/dashboard", require("./dashboard/main"))

app.get("/", (req, res) => {
    res.render("main", {
        user: req.user
    })
})

app.get("/login", (req, res) => {
    res.redirect(`/auth/login`)
})

app.listen(3000)