import { matchedData } from "express-validator";
import { Response, NextFunction } from "express";

import prisma from "../utils/util.prisma";
import { RequestUser } from "../middlerwares/middlerware.examineToken";

interface List {
    id: string;
    list: string;
    do: boolean;
}

export async function readLists(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const lists: List[] = await prisma.todoList.findMany({
            select: {
                id: true,
                list: true,
                do: true
            },
            where: {
                userId: req.user?.id
            }
        });

        return res.status(200).json(lists);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function readList(req: RequestUser, res: Response, next: NextFunction) {
    try {
        const { listId } = matchedData(req);
        const list: List = await prisma.todoList.findUniqueOrThrow({
            where: {
                id: listId,
                userId: req.user?.id
            },
            select: {
                id: true,
                list: true,
                do: true
            }
        });

        return res.status(200).json(list);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }
}