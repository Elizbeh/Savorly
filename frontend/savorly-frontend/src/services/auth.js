// services/auth.js
import api from "./api";

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/api/auth/login", { email, password });

  const { user } = response.data;

  if (!user) throw new Error("User not returned from login response");

  return user;
};
