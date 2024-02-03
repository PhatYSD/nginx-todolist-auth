import { matchedData } from "express-validator";
import { Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { RequestUser } from "../middlerwares/middlerware.examineToken";

export default async function createList(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const { list } = matchedData(req) as { list: string };
        const id: string = req.user?.id as string;
        await prisma.$transaction(async trans => {
            await trans.user.update({
                where: {
                    id
                },
                data: {
                    todoList: {
                        create: {
                            list,
                            do: false
                        }
                    }
                }
            });
        });

        return res.status(201).send("Created new list successfully.");
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}