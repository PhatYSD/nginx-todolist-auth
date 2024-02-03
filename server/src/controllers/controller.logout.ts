import { Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { RequestUser } from "../middlerwares/middlerware.examineToken";

export default async function logout(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const accessToken: string = req.cookies.accessToken;
        const refreshToken: string = req.cookies.refreshToken;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 0
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 0
        });

        return res.status(200).send(`Logout successfully.`);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}