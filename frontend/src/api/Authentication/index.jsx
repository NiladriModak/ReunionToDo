import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/user`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async ({ username, email, password }) =>
  await API.post("/register", { username, email, password });
export const loginUser = async ({ email, password }) =>
  await API.post("/login", { email, password });

export const ApiLogout = async () => {
  await API.post("/logout");
};
