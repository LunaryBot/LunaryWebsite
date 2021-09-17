const randomCharacters = require("./randomCharacters")

module.exports = function checkAuth(req, res, next) {
    if(!req.user) {
        let stateID
        
        for(let i; ;i++) {
            stateID = randomCharacters(18)
            if(!global.states.get(stateID)) break;
        }

        global.states.set(stateID, `${req.protocol}://${req.get('host')}${req.originalUrl}`)
        return res.redirect(`/auth/login?state=${stateID}`)
    }
    else return next()
}