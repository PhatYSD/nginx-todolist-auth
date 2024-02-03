import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";

interface ErrorResponse {
    statusCode: number;
    message: string;
}

export default async function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
    const errorResponse: ErrorResponse = {
        statusCode: 500,
        message: "Internal Server Error."
    };

    if (isHttpError(error)) {
        errorResponse.statusCode = error.statusCode;
        errorResponse.message = error.message;
    }
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            errorResponse.statusCode = 409;
            errorResponse.message = `Conflict - Duplicate data found: ${error.meta?.target}`;
        }
        else if (error.code === "P2025") {
            errorResponse.statusCode = 404;
            errorResponse.message = `Not Found - ${error.message}.`;
        }
        else if (error.code === "P2021") {
            errorResponse.statusCode = 404;
            errorResponse.message = `Not Found - The table does not exist in the current database: ${error.meta?.target}`;
        }
        else {
            console.log(error.code);
            errorResponse.message = `Prisma Error - ${error.message}`;
        }
    }
    else if (error instanceof Prisma.PrismaClientValidationError) {
        errorResponse.statusCode = 400;
        errorResponse.message = `Bad Request - Invalid value in request.`;
    }
    else if (error instanceof Error) {
        errorResponse.message = error.message || "Internal Server Error.";
    }

    return res.status(errorResponse.statusCode).send(errorResponse.message);
}