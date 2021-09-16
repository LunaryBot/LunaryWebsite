const router = require("express").Router()
const isObject = require("../../utils/isObject")
const ALL_FLAGS_GUILD_CONFIG = Object.values({
    MANDATORY_REASON: 1 << 0,
    LOG_UNBAN: 1 << 1,
    LOG_UNMUTE: 1 << 2,
    LOG_EVENTS: 1 << 3
}).reduce((all, p) => all | p, 0)
const default_id = /^\d{18}$/i
function verifyDefaultId(val) {
    return default_id.test(val)
}

const types = {
    moderation: [
        { key: "chat_modlogs", verifyType: verifyDefaultId },
        { key: "chat_punish", verifyType: verifyDefaultId },
        { key: "muterole", verifyType: verifyDefaultId },
        {
            key: "configs",
            verifyType: (val) => {
                val = val.bitfield ? val.bitfield : val
                return typeof val == "number" && ALL_FLAGS_GUILD_CONFIG >= val && val > 0
            }
        }
    ]
}
router.post("/:id_guild/save", async(req, res) => {
    let response = {
        status: 200,
        statusText: "Ok"
    }
    try {
        const json = req.body
        if(!json || !json.guildID || !verifyDefaultId(json.guildID) || !json.type || !(json.type in types) || !isObject(json.configs)) {
            response = {
                status: 400,
                statusText: "Bad Request"
            }
            console.log("Bad Request")
        } else {
            const flags = types[`${json.type}`.toLowerCase()]

            const configs = {}
            flags.filter(x => x.key).forEach(x => {
                const key = x.key
                let value = json.configs[key]
                if(!key || !value || typeof value == "undefined") return
                const verify = x.verifyType
                if(verify && !verify(value)) return
                if(value.bitfield) value = value.bitfield
                
                configs[key] = value
            });

            global.GuildsDB.ref(`Servers/${json.guildID}`).update(configs)
        }
    } catch(e) {
        response = {
            status: 500,
            statusText: "Internal Server Error"
        }
    }

    res.json(response)
})

module.exports = router