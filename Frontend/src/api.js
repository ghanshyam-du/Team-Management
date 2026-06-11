
const BASE_URL = "/api";

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}


function createAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}



export const auth = {
  register(formData) {
    return fetchJSON(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  },

  login(credentials) {
    return fetchJSON(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  },
};


export const teams = {
  getAll(token) {
    return fetchJSON(`${BASE_URL}/team`, {
      headers: createAuthHeaders(token),
    });
  },

  getById(teamId, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}`, {
      headers: createAuthHeaders(token),
    });
  },

  create(teamData, token) {
    return fetchJSON(`${BASE_URL}/team`, {
      method: "POST",
      headers: createAuthHeaders(token),
      body: JSON.stringify(teamData),
    });
  },

  update(teamId, teamData, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}`, {
      method: "PATCH",
      headers: createAuthHeaders(token),
      body: JSON.stringify(teamData),
    });
  },

  remove(teamId, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}`, {
      method: "DELETE",
      headers: createAuthHeaders(token),
    });
  },
};



export const members = {
  getAll(teamId, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}/member`, {
      headers: createAuthHeaders(token),
    });
  },

  add(teamId, memberData, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}/member`, {
      method: "POST",
      headers: createAuthHeaders(token),
      body: JSON.stringify(memberData),
    });
  },

  remove(teamId, userId, token) {
    return fetchJSON(`${BASE_URL}/team/${teamId}/member/${userId}`, {
      method: "DELETE",
      headers: createAuthHeaders(token),
    });
  },
};



export const users = {
  getAll(token) {
    return fetchJSON(`${BASE_URL}/users`, {
      headers: createAuthHeaders(token),
    });
  },

  getById(userId, token) {
    return fetchJSON(`${BASE_URL}/users/${userId}`, {
      headers: createAuthHeaders(token),
    });
  },

  remove(userId, token) {
    return fetchJSON(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: createAuthHeaders(token),
    });
  },
};
