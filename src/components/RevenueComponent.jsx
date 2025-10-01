// src/components/RevenueComponent.jsx
import { useEffect, useState } from "react";
import API from "../api"; // Axios instance with baseURL
import { toast } from "react-toastify";

export default function RevenueComponent() {
  const [revenues, setRevenues] = useState([]);
  const [form, setForm] = useState({ source: "", amount: "" });
  const [editId, setEditId] = useState(null);

  // Fetch revenues
  const fetchRevenues = async () => {
    try {
      const res = await API.get("/revenues");
      setRevenues(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch revenues");
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  // Add or update revenue
  const saveRevenue = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/revenues/${editId}`, form);
        toast.success("✅ Revenue updated");
      } else {
        await API.post("/revenues", form);
        toast.success("✅ Revenue added");
      }
      setForm({ source: "", amount: "" });
      setEditId(null);
      fetchRevenues();
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to save revenue");
    }
  };

  // Edit revenue
  const editRevenue = (rev) => {
    setForm({ source: rev.source, amount: rev.amount });
    setEditId(rev.id);
  };

  // Delete revenue
  const deleteRevenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this revenue?")) return;
    try {
      await API.delete(`/revenues/${id}`);
      toast.success("🗑️ Revenue deleted");
      fetchRevenues();
    } catch (err) {
      toast.error("❌ Failed to delete revenue");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">💰 Revenue Management</h1>

      {/* Form */}
      <form
        onSubmit={saveRevenue}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6"
      >
        <input
          type="text"
          placeholder="Source (e.g. Ticket Sales, Sponsorship)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 col-span-2"
        >
          {editId ? "Update Revenue" : "Add Revenue"}
        </button>
      </form>

      {/* Revenues Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">📋 Revenues</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Source</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map((rev) => (
              <tr key={rev.id} className="text-center border-t">
                <td className="p-2 border">{rev.source}</td>
                <td className="p-2 border">${rev.amount}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => editRevenue(rev)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRevenue(rev.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {revenues.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No revenues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
