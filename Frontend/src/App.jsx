import { useState, useEffect } from "react";
import * as api from "./api.js";
import "./App.css";
import AuthPage from "./components/AuthPage.jsx";
import TeamsPage from "./components/TeamsPage.jsx";
import UsersPage from "./components/UsersPage.jsx";


function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}


export default function App() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || null
  );
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState("teams");
  const [allUsers, setAllUsers] = useState([]);

 

  const handleLogin = async (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);

    const decoded = decodeToken(token);
    if (!decoded) return;

    try {
   
      const response = await api.users.getById(decoded.id, token);
      const user = response.data.user;
      console.log("userrespon local", user  );
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch {
     
      const fallbackUser = {
        _id: decoded.id,
        role: decoded.role,
        name: "User",
        email: "",
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem("currentUser", JSON.stringify(fallbackUser));
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };


  useEffect(() => {
    if (!authToken || !currentUser || currentUser.role !== "manager") return;

    api.users
      .getAll(authToken)
      .then((response) => setAllUsers(response.data || []))
      .catch(() => {});
  }, [authToken, currentUser?.role]);

 
  if (!authToken || !currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav>
        <strong>Team Management</strong>

        <span
          className={activeTab === "teams" ? "active" : ""}
          onClick={() => setActiveTab("teams")}
        >
          Teams
        </span>

        {currentUser.role === "manager" && (
          <span
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </span>
        )}

        <span className="user-info">
          {currentUser.name} ({currentUser.role})
        </span>

        <button onClick={handleLogout}>Logout</button>
      </nav>

      
      <div className="page-container">
        {activeTab === "teams" && (
          <TeamsPage token={authToken} currentUser={currentUser} allUsers={allUsers} />
        )}
        {activeTab === "users" && (
          <UsersPage token={authToken} currentUser={currentUser} />
        )}
      </div>
    </>
  );
}
