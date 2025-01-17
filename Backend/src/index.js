const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors")
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("hello world hello");
});

app.use(cors());
app.use(bodyParser.json());
routes(app);

mongoose
  .connect("mongodb://localhost:27017/duantotnghiep2025")
  .then(() => {
    console.log("connection db success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("server is running in port", +port);
});
