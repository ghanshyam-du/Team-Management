import { useState, useEffect } from "react";
import * as api from "../api.js";
import useNotification from "../hooks/useMsg.js";


export default function MembersPanel({ teamId, leadId, token, currentUser, allUsers }) {
  const [membersList, setMembersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages } =
    useNotification();

  const isManager = currentUser.role === "manager";
  const canManageMembers = isManager || currentUser._id === leadId;


  const fetchMembers = async () => {
    try {
      const response = await api.members.getAll(teamId, token);
      setMembersList(response.data.members);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);


  const handleRemoveMember = async (userId) => {
    clearMessages();
    try {
      await api.members.remove(teamId, userId, token);
      setSuccessMessage("Member removed.");
      fetchMembers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const handleAddMember = async (event) => {
    event.preventDefault();
    clearMessages();
    try {
      await api.members.add(teamId, { userId: selectedUserId }, token);
      setSuccessMessage("Member added.");
      setSelectedUserId("");
      fetchMembers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const availableUsers = allUsers.filter(
    (user) => !membersList.find((member) => member.userId?._id === user._id)
  );

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

   
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {canManageMembers && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {membersList.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">No members yet.</td>
            </tr>
          )}
          {membersList.map((member) => (
            <tr key={member._id}>
              <td>{member.userId?.name}</td>
              <td>{member.userId?.email}</td>
              <td>{member.role}</td>
              {canManageMembers && (
                <td>
                  <button
                    className="danger"
                    onClick={() => handleRemoveMember(member.userId?._id)}
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

  
      {canManageMembers && (
        <form
          onSubmit={handleAddMember}
          style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-end" }}
        >
          <div style={{ flex: 2 }}>
            <label>Add Member</label>
            <select
              style={{ marginBottom: 0 }}
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              required
            >
              <option value="">— Select user —</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}
