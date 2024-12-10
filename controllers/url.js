const URL = require("../models/url")
const {nanoid} = require("nanoid")

async function handleGenerateNewShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "url is required"})
    const short_id = nanoid(8)
    await URL.create({
        shortId: short_id,
        redirectURL: body.url,
        visitHistory: [],
    })
    return res.json({id: short_id})
}

module.exports = {
    handleGenerateNewShortUrl
}