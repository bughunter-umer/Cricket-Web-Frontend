import axios from "axios";

const teamAPI = axios.create({
  baseURL: "http://localhost:5000/api/teams", // ✅ Correct full path
});

teamAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default teamAPI;
