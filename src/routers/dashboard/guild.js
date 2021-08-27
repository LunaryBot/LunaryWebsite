const router = require("express").Router()
const { default: axios } = require("axios")
const { Permissions } = require("discord.js")
const checkAuth = require("../../utils/checkAuth")
const cache = new Map()

async function getGuild(guildID) {
    try {
        const data = axios.get(`${process.env.apiURL.replace(/\/$/, "")}/api/dashboard/${guildID}`)
        return (await data).data
    } catch(e) {
        return {
            status: 500,
            statusText: "Internal Server Error",
            data: null,
            query: `Guild ${guildID}`
        }
    }
}

router.get("/:id_guild", checkAuth, async(req, res) => {
    const h = req.user.guilds.find(x => x.id == req.params.id_guild)
    if(!h) return res.redirect("/dashboard/@me")
    if(!checkPerms(h.permissions)) return res.redirect("/dashboard/@me")

    const guild = await getGuild(h.id)
    cache.set(`${req.user.id}_${h.id}`, guild)
    if(!guild || guild.status == 404) return res.redirect(`/dashboard/${h.id}/invite`)
    console.log({ ...guild })
    res.json({ ...guild })
})

function checkPerms(b = 0) {
    const a = new Permissions(b)
    return a.has(8) || a.has(32)
}

module.exports = router