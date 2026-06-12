import joinTeam from "../model/member_join.model.js";
import Team from "../model/team.model.js";

const managerOrTeamLead = async (req, res, next) => {
  try {
  
    if (req.user.role === "manager") return next();

  
    const teamId = req.params.teamId || req.params.id;

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }


    const membership = await joinTeam.findOne({
      userId: req.user._id,
      teamId: teamId,
      role: "team_lead",
    });

    if (membership) {
      req.membership = membership;
      return next();
    }

    const team = await Team.findById(teamId);
    if (team && team.team_lead.toString() === req.user._id.toString()) {
      req.membership = { userId: req.user._id, teamId, role: "team_lead" };
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied — manager or team lead of this team required",
    });
  } catch (err) {
    next(err);
  }
};

export default managerOrTeamLead;
