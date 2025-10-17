import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode"; // install via: npm i jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 Login function
  const login = async (email, password) => {
    console.log("Attempting login with:", { email, password });
    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);

      if (!res.data.token) throw new Error("Token missing in response");

      // Save token
      localStorage.setItem("token", res.data.token);

      // Decode token to extract role (if backend encodes role)
      const decoded = jwtDecode(res.data.token);
      const userData = res.data.user || {
        id: decoded.id,
        name: decoded.name || "Unknown",
        email: decoded.email,
        role: decoded.role || "user",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User set in context:", userData);
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error("Login failed:", errorMsg);
      throw new Error(errorMsg);
    }
  };

  // 🔹 Logout
  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔹 Load user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token) {
      // Try loading user from backend if only token is present
      API.get("/auth/me")
        .then((res) => {
          const userData = res.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
