import createHttpError from "http-errors";
import { Response, NextFunction } from "express";

import { RequestUser } from "./middlerware.examineToken";

export default function requireUser(req: RequestUser, _res: Response, next: NextFunction) {
    if (!req.user) {
        return next(createHttpError(403, "Forbidden - No access rights."));
    }

    return next();
}