const router = require("express").Router()
const checkAuth = require("../utils/checkAuth")

router.get("/", checkAuth, (req, res) => {
    res.redirect("/dashboard/@me")
})

router.get("/@me", checkAuth, (req, res) => {
    res.render("dashboard/profile/main", {
        user: req.user
    })
})

module.exports = router