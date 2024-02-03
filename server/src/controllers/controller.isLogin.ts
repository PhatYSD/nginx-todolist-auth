import { NextFunction, Response } from "express";

import { RequestUser } from "../middlerwares/middlerware.examineToken";

export default function isLogin(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const username = req.user?.username;

        return res.status(200).send(username);
    } catch (error) {
        next(error);
    }
}