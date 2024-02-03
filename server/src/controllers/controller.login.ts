import createHttpError from "http-errors";
import { matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { compare } from "../utils/util.bcrypt";
import { signRefresh } from "../utils/util.jwt";

export default async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = matchedData(req);
        const { password: hashPassword } = await prisma.user.findUniqueOrThrow({
            where: {
                username
            }
        });

        const matchPassword: boolean = await compare(password, hashPassword);

        if (!matchPassword) {
            throw createHttpError(401, "Unauthorized - Invalid password.");
        }

        const token: string = signRefresh({ username });

        res.cookie("refreshToken", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        return res.status(200).json(`Login successfully. Welcome ${username}.`);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}