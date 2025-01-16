const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB CONNECTTION"))
  .catch((err) => console.log(`DB CONNECT ERR `, err));

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit node API",
  });
});
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server is running on port ${port}`));
