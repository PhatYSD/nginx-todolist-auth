import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from "./util.env";

interface SignAccessPayload {
    username: string;
    id: string;
}

export function signAccess({ username, id }: SignAccessPayload): string {
    const payload: SignAccessPayload = { username, id };
    return jwt.sign(payload, JWT_SECRET_ACCESS_TOKEN, {
        expiresIn: "5m"
    });
}

interface Verify {
    error: string | null;
    status: boolean;
}

export interface VerifyAccess extends Verify {
    payload: SignAccessPayload | null;
}

export function verifyAccess(token: string): VerifyAccess {
    const result: VerifyAccess = {
        error: null,
        payload: null,
        status: false
    }
    jwt.verify(token, JWT_SECRET_ACCESS_TOKEN, (error: VerifyErrors | null, decode: string | JwtPayload | undefined) => {
        if (error) {
            result.error = error.message;
        }
        else if (typeof decode === "string" || decode === undefined) {
            result.error = "Invalid payload.";
        }
        else {
            result.payload = decode as SignAccessPayload;
            result.status = true;
        }
    });

    return result;
}

interface SingRefreshPayload {
    username: string;
}

export function signRefresh({ username }: SingRefreshPayload): string {
    const payload: SingRefreshPayload = { username };
    return jwt.sign(payload, JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: "7d"
    });
}

export interface VerifyRefresh extends Verify {
    payload: SingRefreshPayload | null;
}

export function verifyRefresh(token: string): VerifyRefresh {
    const result: VerifyRefresh = {
        error: null,
        payload: null,
        status: false
    }
    jwt.verify(token, JWT_SECRET_REFRESH_TOKEN, (error: VerifyErrors | null, decode: string | JwtPayload | undefined) => {
        if (error) {
            result.error = error.message;
        }
        else if (typeof decode === "string" || !decode) {
            result.error = "Invalid payload.";
        }
        else { 
            result.payload = decode as SingRefreshPayload;
            result.status = true;
        }
    });

    return result;
}