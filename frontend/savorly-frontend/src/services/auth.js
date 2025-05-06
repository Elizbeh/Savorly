// src/services/auth.js
import api from './api';
import Cookies from 'js-cookie';

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/api/auth/login", { email, password });
  const { token, user } = response.data;

  if (!token) throw new Error("Token missing in response");

  Cookies.set("authToken", token, { expires: 7, sameSite: "Strict", path: '/' });

  return user;
};