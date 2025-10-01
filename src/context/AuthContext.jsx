import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (email, password) => {
    console.log("Attempting login with:", { email, password });

    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);

      if (!res.data.token || !res.data.user) {
        console.error("Login failed: token or user missing in response");
        return false;
      }

      // Save token
      localStorage.setItem("token", res.data.token);

      // Ensure role exists
      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role || "user", // default to 'user' if missing
      };
      setUser(userData);

      console.log("User set in context:", userData);
      return true;
    } catch (err) {
      // Show detailed error info
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error("Login failed:", errorMsg);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/me")
        .then((res) => {
          const userData = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role || "user",
          };
          setUser(userData);
          console.log("Loaded user from token:", userData);
        })
        .catch((err) => {
          console.error("Failed to load user from token:", err.response?.data || err.message);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
