const router = require("express").Router()
const { default: axios } = require("axios")
const { Permissions } = require("discord.js")
const checkAuth = require("../../utils/checkAuth")
const chunk = require("../../utils/chunck")
const cache = new Map()
const tokens = [process.env.DISCORD_TOKEN1, process.env.DISCORD_TOKEN2, process.env.DISCORD_TOKEN3]
const users = new Map()

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

router.get("/:id_guild/modlogs", checkAuth, async(req, res) => {
    if(checkGuild(req, res) != true) return

    let logs = await global.LogsDB.ref().once("value")
    logs = Object.entries(logs.val() || {}).map(function([k, v], i) {
        const data = JSON.parse(Buffer.from(v, 'base64').toString('ascii'))
        data.id = k
        return data
    }).filter(x => x.server == req.params.id_guild).sort((a, b) => b.date - a.date) || []

    if(req.query.user && `${req.query.user}`.length == 18) logs = logs.filter(x => x.user == req.query.user)

    const logsChunk = chunk(logs, 25)
    const page = Math.floor(req.query.id ? (logs.findIndex(x => x.id == req.query.id) / 2) + 1 : Math.abs(req.query.page || 1))
    logs = logsChunk[page - 1] || []

    const a = { ...req.user }
    delete a.accessToken
    delete a.refreshToken
    delete a.guilds

    users.set(req.user.id, a)
    try {
        logs = await logs.map(async function(x) {
            if(x.author && !users.get(x.author)) {
                const author = await axios.get(`https://discord.com/api/v9/users/${x.author}`, { 
                    headers: { 
                        Authorization: `Bot ${tokens[Math.floor(Math.random() * tokens.length)]}` 
                    } 
                }).then(a => a.data)

                users.set(x.author, author)
                x.author = author
            } else if(x.author && users.get(x.author)) x.author = users.get(x.author)
            else x.author = {
                id: "000000000000000000",
                username: "unknown",
                tag: "unknown#0000",
                discriminator: "0000",
                avatar: "https://cdn.discordapp.com/embed/avatars/1.png"
            }

            if(x.user && !users.get(x.user)) {
                const user = await axios.get(`https://discord.com/api/v9/users/${x.user}`, { 
                    headers: { 
                        Authorization: `Bot ${tokens[Math.floor(Math.random() * tokens.length)]}` 
                    } 
                }).then(a => a.data)

                const avatar = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${Boolean(user.avatar.startsWith("a_")) ? "gif" : "png"}` : "https://cdn.discordapp.com/embed/avatars/1.png"
                const userData = {
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    tag: `${user.username}#${user.discriminator}`,
                    avatar: avatar
                }

                users.set(x.user, userData)
                x.user = userData
            } else if(x.user && users.get(x.user)) x.user = users.get(x.user)
            else x.user = {
                id: "000000000000000000",
                username: "unknown",
                tag: "unknown#0000",
                discriminator: "0000",
                avatar: "https://cdn.discordapp.com/embed/avatars/1.png"
            }

            return x
        })

        logs = await Promise.all(logs)
    } catch(_) {
        return res.redirect("/dashboard/@me")
    }
    
    const guild = req.user.guilds.find(x => x.id == req.params.id_guild)
    if(guild.icon) guild.icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${Boolean(guild.icon.startsWith("a_")) ? "gif" : "png"}`

    res.render("dashboard/guild/modlogs", {
        guild: guild,
        user: req.user,
        permissions: Permissions,
        logs: logs,
        page: page,
        pages: logsChunk.length,
        id: req.query.id
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