// Check Token and Create Access Token by Refresh Token

import { Request, Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { VerifyAccess, VerifyRefresh, signAccess, verifyAccess, verifyRefresh } from "../utils/util.jwt";

export interface RequestUser extends Request {
    user?: {
        username: string;
        id: string;
    };
}

export default async function examineToken(req: RequestUser, res: Response, next: NextFunction) {
    const accessToken: string = req.cookies.accessToken;
    const refreshToken: string = req.cookies.refreshToken;
    const accessVerify: VerifyAccess = verifyAccess(accessToken);
    const refreshVerify: VerifyRefresh = verifyRefresh(refreshToken);

    if (!refreshVerify.status) {
        return next();
    }

    if (accessVerify.status) {
        const id: string = accessVerify.payload?.id as string;
        const username: string = accessVerify.payload?.username as string;
        req.user = {
            id,
            username
        };

        return next();
    }

    try {
        const username: string = refreshVerify.payload?.username as string;
        const { id }: { id: string } = await prisma.user.findUniqueOrThrow({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        const newAccessToken: string = signAccess({ username, id });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 5
        });

        req.user = {
            id,
            username
        }

        return next();
    } catch {
        res.cookie("refreshToken", "", {
            httpOnly: true,
            maxAge: 0
        });

        return next();
    }
}