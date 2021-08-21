module.exports = function checkAuth(req, res, next) {
    if (!req.user) {
        const params = new URLSearchParams({
            url: req.url.replace(/^\//, "")
        }).toString()

        console.log(`/auth/login${params != "url=undefined" ? `?${params}` : ""}`)
        return res.redirect(`/auth/login${params != "url=undefined" ? `?${params}` : ""}`)
    }

    else return next()
}