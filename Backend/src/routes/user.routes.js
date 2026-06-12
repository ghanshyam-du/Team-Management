import { Router } from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import managerOnly from "../middleware/managerOnly.middleware.js";

import {
    deleteUser,
    getAllUsers,
    getUser

} from "../controller/user.controller.js"

const router = Router();

router.use(authenticate);

router.get("/", managerOnly, getAllUsers);
router.get("/:id", getUser);

router.delete("/:id", managerOnly, deleteUser);


export default router;