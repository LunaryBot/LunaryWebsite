require("dotenv").config()
require("../strategy")
const express = require("express")
const path = require("path")
const passport = require("passport")
const app = express()
const session = require("express-session")

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
console.log(path.join(__dirname, '../assets'))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/auth", require("./auth"))

app.get("/", (req, res) => {
    res.render("main", {
        user: req.user
    })
})

app.get("/login", passport.authenticate('discord'))

app.listen(3000)