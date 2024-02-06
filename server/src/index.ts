import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";

import app from "./app";
import { PORT, NODE_ENV } from "./utils/util.env";
import limiter from "./middlerwares/middlerware.limiter";
import examineToken from "./middlerwares/middlerware.examineToken";
import errorHandler from "./middlerwares/middlerware.errorhandler";

const server: Express = express();
const morganMode: "combined" | "dev" = NODE_ENV === "production" ? "combined" : "dev";
const corsOption: CorsOptions = {
    credentials: true,
    origin: NODE_ENV === "production" ? "http://localhost" : "http://localhost:5050"
};

// Cross origin
server.use(cors(corsOption));
// Show logging
server.use(morgan(morganMode));
// Use json
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// DDoS protect
server.set("trust proxy", 1);
server.use(helmet());
server.use(limiter);
// Use cookie
server.use(cookieParser());

// Check and create access token token
server.use(examineToken);
// Use application
server.use(app);
// Use error handler
server.use(errorHandler);

server.listen(PORT, () => {
    if (NODE_ENV === "production") {
        console.log(`Server listening on port: ${PORT}`);
    }
    else if (NODE_ENV === "development") {
        console.log(`Server listening on: http://localhost:${PORT}/`);
    }
    else {
        console.log(`Listening on port: ${PORT}`);
    }
});