const express = require("express");
const urlRoute = require("./routes/url");
const connectMongoDb = require("./connection");
const URL = require("./models/url");
const path = require("path")

const app = express();
const PORT = 8001;

// connection
connectMongoDb("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("MongoDb Error", err));


// views - ejs
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

// middleware
app.use(express.json());

// route
app.use("/url", urlRoute);
app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortId: shortID },
    { $push: { visitHistory: { timestamps: Date.now() } } }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
