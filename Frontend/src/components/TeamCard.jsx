import { useState } from "react";
import * as api from "../api.js";
import useNotification from "../hooks/useMsg.js";
import MembersPanel from "./MembersPanel.jsx";


export default function TeamCard({ team, token, currentUser, allUsers, onRefresh }) {
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    team_name: team.team_name,
    description: team.description,
  });
  const { errorMessage, setErrorMessage, clearMessages } = useNotification();

  const isManager = currentUser.role === "manager";
  const teamLeadId = team.team_lead?._id || team.team_lead;
  const canEditTeam = isManager || currentUser._id === teamLeadId;


  const handleSaveEdit = async (event) => {
    event.preventDefault();
    clearMessages();
    try {
      await api.teams.update(team._id, editFormData, token);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const handleDeleteTeam = async () => {
    if (!confirm("Delete this team?")) return;
    try {
      await api.teams.remove(team._id, token);
      onRefresh();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setIsMembersPanelOpen(false);
  };

  const toggleMembersPanel = () => {
    setIsMembersPanelOpen(!isMembersPanelOpen);
    setIsEditing(false);
  };

  return (
    <div className="card">
      {/* Team Header Row */}
      <div className="row">
        <div>
          <strong>{team.team_name}</strong>
          <span className="muted" style={{ marginLeft: 8 }}>
            Lead: {team.team_lead?.name || "—"}
          </span>
          <span className="muted" style={{ marginLeft: 8 }}>
            {team.description}
          </span>
        </div>
        <div>
          {canEditTeam && (
            <button onClick={toggleEdit}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
          {isManager && (
            <button className="danger" onClick={handleDeleteTeam}>
              Delete
            </button>
          )}
          <button onClick={toggleMembersPanel}>
            {isMembersPanelOpen ? "▲" : "▼ Members"}
          </button>
        </div>
      </div>

  
      {errorMessage && (
        <p className="error-message" style={{ marginTop: 6 }}>{errorMessage}</p>
      )}

    
      {isEditing && (
        <form onSubmit={handleSaveEdit} style={{ marginTop: 10 }}>
          <div className="grid-2-columns">
            <div>
              <label>Team Name</label>
              <input
                value={editFormData.team_name}
                onChange={(event) =>
                  setEditFormData({ ...editFormData, team_name: event.target.value })
                }
              />
            </div>
            <div>
              <label>Description</label>
              <input
                value={editFormData.description}
                onChange={(event) =>
                  setEditFormData({ ...editFormData, description: event.target.value })
                }
              />
            </div>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}


      {isMembersPanelOpen && (
        <MembersPanel
          teamId={team._id}
          leadId={teamLeadId}
          token={token}
          currentUser={currentUser}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}
