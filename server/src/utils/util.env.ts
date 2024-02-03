import { cleanEnv, str, num } from "envalid";

const env = cleanEnv(process.env, {
    PORT: num(),
    NODE_ENV: str(),
    JWT_SECRET_ACCESS_TOKEN: str(),
    JWT_SECRET_REFRESH_TOKEN: str()
});

export const {
    PORT,
    NODE_ENV,
    JWT_SECRET_ACCESS_TOKEN,
    JWT_SECRET_REFRESH_TOKEN
} = env;