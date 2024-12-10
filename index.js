const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectMongoDb = require("./connection");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

// connection
connectMongoDb("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("MongoDb Error", err));

// views - ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.json()); // for supporting json data
app.use(express.urlencoded({ extended: false })); // for supporting form data while post req
app.use(cookieParser());

// route
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortId: shortID },
    { $push: { visitHistory: { timestamps: Date.now() } } }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
