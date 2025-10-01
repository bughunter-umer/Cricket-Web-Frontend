// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/admin/investors", label: "Investors" },
    { path: "/admin/teams", label: "Teams" },
    { path: "/admin/matches", label: "Matches" },
    { path: "/admin/players", label: "Players" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/trophies", label: "Trophies" },
    { path: "/admin/revenues", label: "Revenue" },
  ];

  const handleLogout = () => {
    // Clear user token or session
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold p-4 border-b">🏏 Admin Panel</h2>
        <ul className="space-y-1 p-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-2 rounded-md ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
