import { Router } from "express";
import authenticate from "../middleware/authenticate.middleware.js";
import managerOnly from "../middleware/managerOnly.middleware.js";
import managerOrTeamLead from "../middleware/managerOrTeamLead.middleware.js"

import {
    getAllTeams,
    getMyTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam

} from "../controller/team.controller.js";

import {
    getMembers,
    addMember,
    removeMember

} from "../controller/member.controller.js";

const router = Router();

router.use(authenticate);


router.get("/", getAllTeams);
router.get("/my", getMyTeams);
router.get("/:id", getTeam);

router.post("/", managerOnly, createTeam);

router.patch("/:id", managerOrTeamLead, updateTeam);

router.delete("/:id",managerOnly ,deleteTeam);


router.get("/:teamId/member", getMembers);

router.post("/:teamId/member",managerOrTeamLead ,addMember);

router.delete("/:teamId/member/:userId", managerOrTeamLead, removeMember);


export default router;