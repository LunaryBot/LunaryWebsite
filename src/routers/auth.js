const router = require("express").Router()
const passport = require("passport")
const generateOauth2 = require("../strategy/generateOauth2")
const redirectCache = new Map()

router.get("/", (req, res) => res.redirect(`/auth/login${req.query.state ? `?state=${req.query.state}` : ""}`))

router.get("/login", (req, res) => {
    const url = generateOauth2({
        scopes: ["guilds", "identify"],
        redirect_uri: process.env.callback,
        state: req.query.state || null
    })

    res.redirect(url)
})

router.get("/redirect", passport.authenticate("discord", {
        failureRedirect: "/"
    }), (req, res) => {
        if(req.query.state) {
            const stateURL = global.states.get(req.query.state)
            if(stateURL) {
                global.states.delete(req.query.state)
                return res.redirect(stateURL)
            }
        }

        res.redirect(`/dashboard/${req.query.guild ? `guild/${req.query.guild}` : `@me`}`)
    }
)

module.exports = router