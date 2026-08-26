import api from "./api";

export async function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token, token_type } = response.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("token_type", token_type);

  return response.data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("access_token"));
}


export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data;
}