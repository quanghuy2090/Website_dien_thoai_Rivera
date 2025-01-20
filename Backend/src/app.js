import express from "express"

const app = express();

app.use(express.json());

export const viteNodeApp = app