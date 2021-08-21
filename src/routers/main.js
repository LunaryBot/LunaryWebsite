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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/auth", require("./auth"))
app.use("/dashboard", require("./dashboard"))

app.get("/", (req, res) => {
    res.render("main", {
        user: req.user
    })
})

app.get("/login", (req, res) => {
    const params = new URLSearchParams({
        url: req.query.url
    }).toString()

    res.redirect(`/auth/login${params != "url=undefined" ? `?${params}` : ""}`)
})

app.listen(3000)