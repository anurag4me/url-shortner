const URL = require("../models/url");
const shortid = require("shortid");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortId = shortid();
  await URL.create({
    shortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  req.flash("id", shortId)
  return res.redirect('/');
}

async function handleGetAnalytics(req, res) {
  const shortID = req.params.shortID;
  const result = await URL.findOne({ shortId: shortID });
  if (!result) return res.status(404).json({ error: "url not found" });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
