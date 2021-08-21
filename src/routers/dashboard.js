const router = require("express").Router()
const checkAuth = require("../utils/checkAuth")

router.get("/", checkAuth, (req, res) => {
    res.send("Ok!")
})

router.get("/a", checkAuth, (req, res) => {
    res.send("...")
})

module.exports = router