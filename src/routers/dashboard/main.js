const router = require("express").Router()
const { Permissions } = require("discord.js")
const checkAuth = require("../../utils/checkAuth")

router.get("/", checkAuth, (req, res) => {
    res.redirect("/dashboard/@me")
})

router.get("/@me", checkAuth, (req, res) => {
    res.render("dashboard/profile/main", {
        user: req.user,
        permissions: Permissions
    })
})

router.use("/guild", require("./guild"))

module.exports = router