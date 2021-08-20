const router = require("express").Router()
const passport = require("passport")

router.get("/", (req, res) => {})
router.get("/redirect", passport.authenticate("discord", {
    failureRedirect: "/"
}), (req, res) => {
    res.send(req.user.id)
})

module.exports = router