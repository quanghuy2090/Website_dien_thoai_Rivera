import express from "express"
import connectDb from "./config/Db";
import cors from "cors";
import productRouter from "./routers/productRouter";
import uploadRouter from "./routers/uploadRoutes";
const app = express();
app.use(cors());
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", productRouter);
app.use("/api", uploadRouter);
connectDb()
export const viteNodeApp = app