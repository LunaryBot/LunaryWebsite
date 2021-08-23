const router = require("express").Router()
const passport = require("passport")
const redirectCache = new Map()

router.get("/", (req, res) => res.redirect("/auth/login"))

router.get("/login", passport.authenticate('discord'))

router.get("/redirect", passport.authenticate("discord", {
        failureRedirect: "/"
    }), (req, res) => {
        res.redirect(`/dashboard${req.query.guild ? `/${req.query.guild}` : ``}`)
    }
)

module.exports = router