import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    team_name:{
        type: String,
        required: true

    },
    team_lead:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true

    },
    description:{

        type: String,
        required : true
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});


const Team = mongoose.model("Team", teamSchema);

export default Team;