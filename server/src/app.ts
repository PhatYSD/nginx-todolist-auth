import express, { Express } from "express";

import { authRouter, todolistRouter } from "./routers";

const app: Express = express();

app.get("/", (_req, res) => res.sendStatus(200));
app.use("/auth", authRouter);
app.use("/todolist", todolistRouter);

export default app;