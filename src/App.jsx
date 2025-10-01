import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Admin Pages
import InvestorPage from "./pages/admin/InvestorPage.jsx";
import TeamPage from "./pages/admin/TeamPage.jsx";
import MatchPage from "./pages/admin/MatchPage.jsx";
import PlayerPage from "./pages/admin/PlayerPage.jsx";
import UserPage from "./pages/admin/UserPage.jsx";
import TrophyPage from "./pages/admin/TrophyPage.jsx";
import RevenuePage from "./pages/admin/RevenuePage.jsx";

// User Pages
import UserMatch from "./pages/user/UserMatch.jsx";

// Auth
import Login from "./pages/LoginPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/investors"
            element={
              <ProtectedRoute role="admin">
                <InvestorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute role="admin">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches"
            element={
              <ProtectedRoute role="admin">
                <MatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/players"
            element={
              <ProtectedRoute role="admin">
                <PlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trophies"
            element={
              <ProtectedRoute role="admin">
                <TrophyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/revenues"
            element={
              <ProtectedRoute role="admin">
                <RevenuePage />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin → /admin/investors */}
          <Route path="/admin" element={<Navigate to="/admin/investors" replace />} />

          {/* User Routes */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute role="user">
                <UserMatch />
              </ProtectedRoute>
            }
          />

          {/* Root → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={<h1 className="text-center text-red-500 text-xl">❌ Unauthorized Access</h1>}
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={<h1 className="text-center text-gray-500 text-xl">404 - Page Not Found</h1>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
