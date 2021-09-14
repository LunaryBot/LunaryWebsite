const router = require("express").Router()

router.post("/:id_guild/save", async(req, res) => {
    try {
        require('raw-body')(req, {}, (error, body) => {
            const json = JSON.parse(body.toString('utf8'))
        
            console.log(json)
        })

        res.send({
            status: 200,
            statusText: "Ok"
        })
    } catch(_) {
        res.send({
            status: 400,
            statusText: "Bad Request"
        })
    }
})

module.exports = router