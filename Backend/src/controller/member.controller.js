import joinTeam from "../model/member_join.model.js";
import User from "../model/user.model.js";
import Team from "../model/team.model.js";


const getMembers = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team does not exist" });
        }

        const members = await joinTeam.find({ teamId: req.params.teamId })
            .populate("userId", "name email department role");

        return res.status(200).json({
            success: true,
            message: "Members fetched",
            data: { members },
        });
    } catch (err) {
        next(err);
    }
};


const addMember = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.body;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }


        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const exist = await joinTeam.findOne({ userId, teamId });
        if (exist) {
            return res.status(409).json({
                success: false,
                message: "User is already a member of this team",
            });
        }

        const membership = await JoinTeam.create({
            userId,
            teamId,
            role: "member"
        });
        await membership.populate("userId", "name email department");

        return res.status(201).json({
            success: true,
            message: "Member added",
            data: { membership },
        });
    } catch (err) {
        next(err);
    }
};



const removeMember = async (req, res, next) => {
    try {
        const { teamId, userId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        const membership = await joinTeam.findOne({ teamId, userId });
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Member not found in this team",
            });
        }


        if (req.user.role !== "manager") {

            if (membership.role === "team_lead") {
                return res.status(403).json({
                    success: false,
                    message: "Team leads cannot remove other team leads",
                });
            }

            if (req.user._id.toString() === userId) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot remove yourself from the team",
                });
            }
        }


        if (req.user.role === "manager" && membership.role === "team_lead") {
            return res.status(400).json({
                success: false,
                message: "Change the role of team lead to the member ",
            });
        }

        await membership.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });
    } catch (err) {
        next(err);
    }
};


export {
    getMembers,
    addMember,
    removeMember
};