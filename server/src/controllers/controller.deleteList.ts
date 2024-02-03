import { matchedData } from "express-validator";
import { Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { RequestUser } from "../middlerwares/middlerware.examineToken";

export default async function deleteList(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const { listId } = matchedData(req) as { listId: string };
        await prisma.$transaction(async trans => {
            await trans.todoList.delete({
                where: {
                    id: listId
                }
            });
        });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}