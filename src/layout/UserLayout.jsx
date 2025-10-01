import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"; // your footer
import Navbar from "../components/Navbar";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
