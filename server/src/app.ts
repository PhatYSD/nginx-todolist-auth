import express, { Express, Request, Response } from "express";

import { authRouter, todolistRouter } from "./routers";

const app: Express = express();

app.get("/", (_req: Request, res: Response) => res.sendStatus(200));
app.use("/auth", authRouter);
app.use("/todolist", todolistRouter);

export default app;
