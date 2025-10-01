import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">🏏 Cricket League</Link>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/matches" className="hover:text-gray-200">
            Matches
          </Link>
        </li>
        <li>
          <Link to="/teams" className="hover:text-gray-200">
            Teams
          </Link>
        </li>
        <li>
          <Link to="/trophies" className="hover:text-gray-200">
            Player
          </Link>
        </li>
      </ul>
    </nav>
  );
}
