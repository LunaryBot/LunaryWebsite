const router = require("express").Router()
const { default: axios } = require("axios")
const { Permissions } = require("discord.js")
const checkAuth = require("../../utils/checkAuth")
const cache = new Map()

router.get("/:id_guild", checkAuth, async(req, res) => {
    if(checkGuild(req, res) != true) return

    const guild = await getGuild(req.params.id_guild)
    if(!guild || guild.status == 404) return res.redirect(`/dashboard/${req.params.id_guild}/invite`)
    cache.set(`${req.user.id}_${req.params.id_guild}`, guild)

    res.redirect(`/dashboard/guild/${req.params.id_guild}/home`)
})

router.get("/:id_guild/home", checkAuth, async(req, res) => {
    if(checkGuild(req, res) != true) return

    const guild = await getCacheGuild(req.user.id, req.params.id_guild)
    if(!guild) return res.redirect("/dashboard/@me")
    
    res.render("dashboard/guild/main", {
        guild: guild.data,
        user: req.user,
        permissions: Permissions
    })
})

router.get("/:id_guild/moderation", checkAuth, async(req, res) => {
    if(checkGuild(req, res) != true) return

    const guild = await getCacheGuild(req.user.id, req.params.id_guild)
    if(!guild) return res.redirect("/dashboard/@me")
    
    res.render("dashboard/guild/moderation", {
        guild: guild.data,
        user: req.user,
        permissions: Permissions
    })
})

async function getCacheGuild(userID, guildID) {
    let guild = cache.get(`${userID}_${guildID}`)
    if(guild) return guild

    guild = await getGuild(guildID)

    cache.set(`${userID}_${guildID}`, guild)
    return guild
}

function checkGuild(req, res) {
    const h = req.user.guilds.find(x => x.id == req.params.id_guild)
    if(!h) return res.redirect("/dashboard/@me")
    if(!checkPerms(h.permissions)) return res.redirect("/dashboard/@me")

    return true
}

function checkPerms(b = 0) {
    const a = new Permissions(b)
    return a.has(8) || a.has(32)
}

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

module.exports = router