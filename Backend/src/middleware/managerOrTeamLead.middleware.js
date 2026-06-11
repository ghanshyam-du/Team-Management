import joinTeam from "../model/member_join.model.js";

const managerOrTeamLead = async (req, res, next) => {
  try {
  
    if (req.user.role === "manager") return next();

  
    const teamId = req.params.teamId || req.params.id;

    const membership = await joinTeam.findOne({
      userId: req.user._id,
      teamId: teamId,
      role: "team_lead",
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied — manager or team lead of this team required",
      });
    }

    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
};

export default managerOrTeamLead;
