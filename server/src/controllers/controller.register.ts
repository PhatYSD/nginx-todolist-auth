import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

import prisma from "../utils/util.prisma";
import { hash } from "../utils/util.bcrypt";
import { signRefresh } from "../utils/util.jwt";

export default async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = matchedData(req);
        const hashPassword = await hash(password);
        await prisma.$transaction(async trans => {
            await trans.user.create({
                data: {
                    username,
                    password: hashPassword
                }
            });
        });

        const token: string = signRefresh({ username });

        res.cookie("refreshToken", token);
        return res.status(201).send(`Register successfully.`);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}