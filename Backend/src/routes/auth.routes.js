import express from "express"
import { hanldeLogin, handleRegister } from "../controller/auth.controller.js"

const router = express.Router();

router.post("/register", handleRegister);

router.post("/login",  hanldeLogin);



export default router;