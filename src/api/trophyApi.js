import axios from "axios";

const trophyAPI = axios.create({
  baseURL: "http://localhost:5000/api/trophies", // ✅ Correct full path
});

trophyAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default trophyAPI;
