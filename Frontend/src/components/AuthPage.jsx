import { useState } from "react";
import * as api from "../api.js";
import useNotification from "../hooks/useMsg.js";

export default function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });
  const { errorMessage, setErrorMessage } = useNotification();


  const updateField = (fieldName) => (event) => {
    setFormData({ ...formData, [fieldName]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (activeTab === "login") {
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });
        onLogin(response.token);
      } else {
       
        await api.auth.register(formData);
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });
        onLogin(response.token);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const isLogin = activeTab === "login";

  return (
    <div className="auth-container">
      <h2>Team Management</h2>

      {/* Tab Buttons */}
      <div className="auth-tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label>Name</label>
            <input value={formData.name} onChange={updateField("name")} required />
          </>
        )}

        <label>Email</label>
        <input type="email" value={formData.email} onChange={updateField("email")} required />

        <label>Password</label>
        <input type="password" value={formData.password} onChange={updateField("password")} required />

        {!isLogin && (
          <>
            <label>Department</label>
            <input value={formData.department} onChange={updateField("department")} />

            <label>Role</label>
            <select value={formData.role} onChange={updateField("role")}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </>
        )}

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
}
