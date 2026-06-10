import mongoose from "mongoose";

const joinTeamSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    teamId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    role:{
        type: String,
        enum:["member", "team_lead"],
        default: "member"
    }
}, {timestamps:true})


joinTeamSchema.index(
  { userId: 1, teamId: 1 },
  { unique: true }
);

const joinTeam = mongoose.model("joinTeam", joinTeamSchema);

export default joinTeam;