import { Router } from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import managerOnly from "../middleware/managerOnly.middleware.js";

import {
    deleteUser,
    getAllUsers,
    getUser

} from "../controller/user.controller.js"

const router = Router();

router.use(authenticate, managerOnly);

router.get("/", getAllUsers);
router.get("/:id", getUser);

router.delete("/:id", deleteUser);


export default router;