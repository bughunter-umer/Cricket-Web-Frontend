import axios from "axios";

const userAPI = axios.create({
  baseURL: "http://localhost:5000/api/users", // ✅ Correct full path
});

userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default userAPI;
