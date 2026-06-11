import { useState, useEffect } from "react";
import * as api from "../api.js";
import useNotification from "../hooks/useMsg.js";
import TeamCard from "./TeamCard.jsx";


export default function TeamsPage({ token, currentUser, allUsers }) {
  const [teamsList, setTeamsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTeamForm, setNewTeamForm] = useState({
    team_name: "",
    description: "",
    team_lead: "",
  });
  const { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages } =
    useNotification();

  const isManager = currentUser.role === "manager";


  const fetchTeams = async () => {
    try {
      const response = await api.teams.getAll(token);
      let teams = response.data || [];

  
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        teams = teams.filter(
          (team) =>
            team.team_name?.toLowerCase().includes(query) ||
            team.description?.toLowerCase().includes(query)
        );
      }

      setTeamsList(teams);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);


  const handleCreateTeam = async (event) => {
    event.preventDefault();
    clearMessages();
    try {
      await api.teams.create(newTeamForm, token);
      setSuccessMessage("Team created successfully.");
      setNewTeamForm({ team_name: "", description: "", team_lead: "" });
      fetchTeams();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>

      {isManager && (
        <>
          <h2>Create Team</h2>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <form onSubmit={handleCreateTeam}>
            <div className="grid-3-columns">
              <div>
                <label>Team Name</label>
                <input
                  value={newTeamForm.team_name}
                  onChange={(event) =>
                    setNewTeamForm({ ...newTeamForm, team_name: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  value={newTeamForm.description}
                  onChange={(event) =>
                    setNewTeamForm({ ...newTeamForm, description: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Team Lead</label>
                <select
                  value={newTeamForm.team_lead}
                  onChange={(event) =>
                    setNewTeamForm({ ...newTeamForm, team_lead: event.target.value })
                  }
                  required
                >
                  <option value="">— Select lead —</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit">Create</button>
          </form>
        </>
      )}


      <h2>
        All Teams
        <input
          placeholder="Search teams…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && fetchTeams()}
          style={{ width: 160, marginLeft: 10 }}
        />
        <button onClick={fetchTeams} style={{ marginLeft: 4 }}>Search</button>
      </h2>

      {teamsList.length === 0 && <p className="muted">No teams found.</p>}

      {teamsList.map((team) => (
        <TeamCard
          key={team._id}
          team={team}
          token={token}
          currentUser={currentUser}
          allUsers={allUsers}
          onRefresh={fetchTeams}
        />
      ))}
    </>
  );
}
