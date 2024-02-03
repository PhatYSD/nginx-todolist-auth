import { Router } from "express";
import { body, param } from "express-validator";

import { createList, deleteList, doList, readList, readLists, undoList } from "../controllers";
import { validate } from "../middlerwares/middlerware.validate";
import requireUser from "../middlerwares/middlerware.requireUser";

const todolistRouter: Router = Router();

// App routes mush have user ID.
todolistRouter.use(requireUser);

todolistRouter.get("/", readLists);
todolistRouter.get("/:listId",
    param("listId")
        .isLength({ max: 36, min: 36 })
        .withMessage("ListId must be 36 characters."),
    validate,
    readList
);

todolistRouter.patch("/do/:listId",
    param("listId")
        .isLength({ max: 36, min: 36 })
        .withMessage("ListId must be 36 characters."),
    validate,
    doList
);
todolistRouter.patch("/undo/:listId",
    param("listId")
        .isLength({ max: 36, min: 36 })
        .withMessage("ListId must be 36 characters."),
    validate,
    undoList
);

todolistRouter.delete("/:listId",
    param("listId")
        .isLength({ max: 36, min: 36 })
        .withMessage("ListId must be 36 characters."),
    validate,
    deleteList
);

todolistRouter.post("/",
    body("list")
        .notEmpty()
        .withMessage("List cannot be empty.")
        .isLength({ max: 128, min: 4 })
        .withMessage("Username must be between 4 and 128 characters."),
    validate,
    createList
);

export default todolistRouter;