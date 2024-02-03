import { Router } from "express";
import { body } from "express-validator";

import { register, login, isLogin, logout } from "../controllers";
import requireUser from "../middlerwares/middlerware.requireUser";
import { validate } from "../middlerwares/middlerware.validate";

const authRouter: Router = Router();

authRouter.get("/", requireUser, isLogin);
authRouter.delete("/", requireUser, logout);

authRouter
    .use(
        [
            body("username")
                .notEmpty()
                .withMessage("Username cannot be empty.")
                .isLength({ max: 16, min: 4 })
                .withMessage("Username must be between 4 and 16 characters.")
                .isAlphanumeric()
                .withMessage("Username must contain only letters and numbers.")
                .matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
                .withMessage("Username must start with a letter and contain only letters and numbers.")
                .custom(value => !/\s/.test(value))
                .withMessage("Username cannot contain spaces."),
            body("password")
                .notEmpty()
                .withMessage("Password cannot be empty.")
                .isLength({ min: 4, max: 16 })
                .withMessage("Password must be between 4 and 16 characters.")
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter.')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter.')
                .matches(/\d/)
                .withMessage('Password must contain at least one number.')
        ],
        validate
    );

authRouter.post("/register", register);
authRouter.post("/", login);

export default authRouter;