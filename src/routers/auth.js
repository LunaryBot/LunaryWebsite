const router = require("express").Router()
const passport = require("passport")
const redirectCache = new Map()

router.get("/", (req, res) => res.redirect("/auth/login"))

router.get("/login", (req, res, next) => {
    const url = req.query.url
    if(typeof url != "string") {
        return next()
    }

    console.log(req.sessionID)
    redirectCache.set(`${req.sessionID}`, url)
    return next()
},
    passport.authenticate('discord')
)

router.get("/redirect", passport.authenticate("discord", {
        failureRedirect: "/"
    }), (req, res) => {
        const redirect = redirectCache.get(`${req.sessionID}`)
        console.log(req.sessionID)
        res.redirect(`/${redirect ? redirect : `dashboard`}`)
    }
)

module.exports = router