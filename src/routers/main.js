require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()

app.use(express.static(path.join(__dirname, '../pages')))

app.get("/", (req, res) => {
    res.sendFile("src/pages/index.html")
})

app.listen(3000)