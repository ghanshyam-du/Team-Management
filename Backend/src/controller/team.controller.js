  import Team from "../model/team.model.js";
  import joinTeam from "../model/member_join.model.js";

 
 export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate("team_lead")
      .populate("created_by");

    return res.status(200).json({success: true, data: teams,});
  } catch (err) {
    next(err);
  }
};


export const getMyTeams = async (req, res, next) => {
  try {
    const teams = await JoinTeam.find({
      userId: req.user._id
    }).populate("teamId");

    res.status(200).json({ success: true, teams});

  } catch (err) {
    next(err);
  }
};


  export const getTeam = async (req, res, next) => {
    try {
      const team = await Team.findById(req.params.id)
        .populate("team_lead", "name email department")
        .populate("created_by", "name email");

      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }

      const members = await JoinTeam.find({ teamId: req.params.id }).populate(
        "userId",
        "name email department role"
      );

      return res.status(200).json({
        success: true,
        message: "Team fetched",
        data: { team, members },
      });
    } catch (err) {
      next(err);
    }
  };


  export const createTeam = async (req, res, next) => {
    try {
      const { team_name, description, team_lead } = req.body;

      const team = await Team.create({
        team_name,
        description,
        team_lead,
        created_by: req.user._id,
      });

    
      await JoinTeam.create({
        userId: team_lead,
        teamId: team._id,
        role: "team_lead",
      });

      const populated = await Team.findById(team._id)
        .populate("team_lead", "name email department")
        .populate("created_by", "name email");

      return res.status(201).json({
        success: true,
        message: "Team created",
        data: { team: populated },
      });
    } catch (err) {
      next(err);
    }
  };

  // PATCH /api/teams/:id  — manager OR team_lead of this team
  // team_lead: can update team_name and description only
  // manager: can also reassign team_lead
  export const updateTeam = async (req, res, next) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }

      const { team_name, description, team_lead } = req.body;
      const updates = {};

      if (team_name) updates.team_name = team_name;
      if (description) updates.description = description;

      
      if (team_lead) {
        if (req.user.role !== "manager") {
          return res.status(403).json({
            success: false,
            message: "You don't have permission to change the team lead",
          });
        }

        
        await JoinTeam.findOneAndUpdate(
          { teamId: team._id, userId: team.team_lead },
          { role: "member" }
        );

        
        await JoinTeam.findOneAndUpdate(
          { teamId: team._id, userId: team_lead },
          { role: "team_lead" },
          { upsert: true, setDefaultsOnInsert: true }
        );

        updates.team_lead = team_lead;
      }

      const updated = await Team.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
        .populate("team_lead", "name email department")
        .populate("created_by", "name email");

      return res.status(200).json({
        success: true,
        message: "Team updated",
        data: { team: updated },
      });
    } catch (err) {
      next(err);
    }
  };

  
  export const deleteTeam = async (req, res, next) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }

     
      await JoinTeam.deleteMany({ teamId: team._id });
      await team.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Team deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
