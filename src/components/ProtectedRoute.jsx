import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role check → unauthorized
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;

  // Authorized → render component
  return children;
}
