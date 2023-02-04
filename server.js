const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { config } = require("dotenv");
require("dotenv").config();

const PORT = Number(5000);

const db_prod =
  process.env.MONGO_PROD || require("./config.json") / config.db_prod;
const db_dev =
  process.env.MONGO_DEV || require("./config.json") / config.db_dev;

//mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(db_prod, { useNewUrlParser: false }, (err) => {
  if (err) throw err;
  console.log("mongo db connected ");
});

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(
  fileupload({
    useTempFiles: true,
  })
);

//routes
app.use("/auth", require("./route/UserRoute"));
app.use("/api", require("./route/ProductRoute"));
app.use("/api", require("./route/ImageRoute"));

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
