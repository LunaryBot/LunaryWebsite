const passport = require("passport")
const { Strategy } = require("passport-discord")
const cache = new Map()

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
    let user = cache.get(id)
    if (user) done(null, user)
})

const discordOuath = new Strategy({
        clientID: process.env.clientId,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callback,
        scope: ["guilds", "identify"]
    },
    function(accessToken, refreshToken, profile, cb) {
        const avatar = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${Boolean(profile.avatar.startsWith("a_")) ? ".gif" : ".png"}` : "https://cdn.discordapp.com/embed/avatars/1.png"

        const user = {
            id: profile.id,
            username: profile.username,
            guilds: profile.guilds,
            discriminator: profile.discriminator,
            tag: `${profile.username}#${profile.discriminator}`,
            avatar: avatar,
            refreshToken: refreshToken,
            accessToken: accessToken
        }

        cache.set(profile.id, user)
        cb(null, user)
    }
)

passport.use(discordOuath)