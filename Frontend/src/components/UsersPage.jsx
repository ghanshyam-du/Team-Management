import { useState, useEffect } from "react";
import * as api from "../api.js";
import useNotification from "../hooks/useMsg.js";


export default function UsersPage({ token, currentUser }) {
  const [usersList, setUsersList] = useState([]);
  const { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages } =
    useNotification();


  const fetchUsers = async () => {
    try {
      const response = await api.users.getAll(token);
      setUsersList(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    clearMessages();
    try {
      await api.users.remove(userId, token);
      setSuccessMessage("User deleted.");
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <h2>All Users</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersList.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "—"}</td>
              <td>{user.role}</td>
              <td>
                {user._id !== currentUser._id && (
                  <button className="danger" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
