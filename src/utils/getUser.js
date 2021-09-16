const { default: axios } = require("axios")
const tokens = [process.env.DISCORD_TOKEN1, process.env.DISCORD_TOKEN2, process.env.DISCORD_TOKEN3]

module.exports = async function getUser(userID) {
    const user = await axios.get(`https://discord.com/api/v9/users/${userID}`, { 
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

    global.users.set(userID, userData)
    return userData
}