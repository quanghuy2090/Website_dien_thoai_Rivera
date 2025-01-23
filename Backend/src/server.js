import express from "express";
import { connect } from "mongoose";
import router from "./routers/index.js";
import cors from "cors";
import dotenvn from "dotenv";

const app = express();
dotenvn.config();
const PORT = process.env.PORT;
const URI_DB = process.env.URI_DB;
connect(URI_DB);

app.use(cors());

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
