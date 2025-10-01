// src/components/TeamComponent.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function TeamComponent() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", city: "", logo_url: "" });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Fetch teams
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch teams");
    }
  };

  // 🔹 Add or Update team
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/teams/${editingId}`, form);
        toast.success("✅ Team updated successfully");
      } else {
        await API.post("/teams", form);
        toast.success("✅ Team added successfully");
      }
      setForm({ name: "", city: "", logo_url: "" });
      setEditingId(null);
      fetchTeams();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "❌ Failed to save team");
    }
  };

  // 🔹 Delete team
  const deleteTeam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await API.delete(`/teams/${id}`);
      toast.success("🗑️ Team deleted");
      fetchTeams();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete team");
    }
  };

  // 🔹 Edit team
  const editTeam = (team) => {
    setForm({ name: team.name, city: team.city, logo_url: team.logo_url });
    setEditingId(team.id);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚽ Teams Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded shadow-md space-y-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Team" : "Add Team"}
        </button>
      </form>

      {/* Teams List */}
      <ul className="mt-6 space-y-2">
        {teams.map((team) => (
          <li
            key={team.id}
            className="flex justify-between items-center bg-white shadow p-3 rounded"
          >
            <div>
              <p className="font-semibold">{team.name}</p>
              <p className="text-sm text-gray-500">{team.city}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editTeam(team)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTeam(team.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
