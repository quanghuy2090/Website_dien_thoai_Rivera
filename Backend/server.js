const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB CONNECTTION"))
  .catch((err) => console.log(`DB CONNECT ERR `, err));

app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "2mb" }));

app.use(cors());

// app.use("/api", authRoutes);

fs.readdirSync("./routes").forEach((file) => {
  console.log(`Loading route file: ${file}`);
  const route = require("./routes/" + file);

  if (
    typeof route === "function" ||
    (route && typeof route.use === "function")
  ) {
    console.log(`Successfully loaded: ${file}`);
    app.use("/api", route); // Mount the router
  } else {
    console.error(
      `Invalid route in file: ${file}. Expected a function or router.`
    );
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on port ${port}`));
