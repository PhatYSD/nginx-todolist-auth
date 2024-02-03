import { Response, NextFunction } from "express";
import { matchedData } from "express-validator";

import prisma from "../utils/util.prisma";
import { RequestUser } from "../middlerwares/middlerware.examineToken";

export async function doList(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const { listId } = matchedData(req) as { listId: string };
        const id: string = req.user?.id as string;
        await prisma.$transaction(async trans => {
            await trans.todoList.update({
                where: {
                    id: listId,
                    userId: id
                },
                data: {
                    do: true
                }
            });
        });

        return res.status(200).send(`You are do it.`);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function undoList(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const { listId } = matchedData(req) as { listId: string };
        const id: string = req.user?.id as string;
        await prisma.$transaction(async trans => {
            await trans.todoList.update({
                where: {
                    id: listId,
                    userId: id
                },
                data: {
                    do: false
                }
            });
        });

        return res.status(200).send(`You are undo it.`);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}