module.exports = function checkAuth(req, res, next) {
    if (!req.user) return res.redirect(`/auth/login`)
    else return next()
}