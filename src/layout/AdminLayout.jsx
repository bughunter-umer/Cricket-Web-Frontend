// src/layout/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
