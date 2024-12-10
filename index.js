const express = require("express");
const urlRoute = require("./routes/url");
const connectMongoDb = require("./connection");

const app = express();
const PORT = 8001;

// connection
connectMongoDb("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("MongoDb Error", err));

// middleware
app.use(express.json());

// route
app.use("/url", urlRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
