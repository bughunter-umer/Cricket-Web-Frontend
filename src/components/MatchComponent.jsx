// src/components/MatchComponent.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function MatchComponent() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    match_date: "",
    venue: "",
    team_a_id: "",
    team_b_id: "",
    team_a_score: "",
    team_b_score: "",
    winner_team_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all matches
  const fetchMatches = async () => {
    try {
      const res = await API.get("/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch matches");
    }
  };

  // Fetch teams for dropdowns
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch teams");
    }
  };

  // Add or update match
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/matches/${editingId}`, form);
        toast.success("✅ Match updated successfully");
      } else {
        await API.post("/matches", form);
        toast.success("✅ Match added successfully");
      }
      resetForm();
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "❌ Failed to save match");
    }
  };

  // Delete match
  const deleteMatch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await API.delete(`/matches/${id}`);
      toast.success("🗑️ Match deleted");
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete match");
    }
  };

  // Edit match
  const editMatch = (match) => {
    setForm({
      match_date: match.match_date?.slice(0, 10) || "",
      venue: match.venue,
      team_a_id: match.team_a_id,
      team_b_id: match.team_b_id,
      team_a_score: match.team_a_score,
      team_b_score: match.team_b_score,
      winner_team_id: match.winner_team_id,
    });
    setEditingId(match.id);
  };

  const resetForm = () => {
    setForm({
      match_date: "",
      venue: "",
      team_a_id: "",
      team_b_id: "",
      team_a_score: "",
      team_b_score: "",
      winner_team_id: "",
    });
    setEditingId(null);
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏏 Matches Management</h1>

      {/* Match Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded shadow-md"
      >
        <input
          type="date"
          value={form.match_date}
          onChange={(e) => setForm({ ...form, match_date: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
          className="border p-2 rounded"
          required
        />
        {/* Team A */}
        <select
          value={form.team_a_id}
          onChange={(e) => setForm({ ...form, team_a_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Team A</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {/* Team B */}
        <select
          value={form.team_b_id}
          onChange={(e) => setForm({ ...form, team_b_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Team B</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {/* Scores */}
        <input
          type="text"
          placeholder="Team A Score"
          value={form.team_a_score}
          onChange={(e) => setForm({ ...form, team_a_score: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Team B Score"
          value={form.team_b_score}
          onChange={(e) => setForm({ ...form, team_b_score: e.target.value })}
          className="border p-2 rounded"
        />
        {/* Winner */}
        <select
          value={form.winner_team_id}
          onChange={(e) => setForm({ ...form, winner_team_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Winner</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="col-span-2 flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Match" : "Add Match"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Matches Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">📋 Matches List</h2>
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Venue</th>
              <th className="p-2">Team A</th>
              <th className="p-2">Team B</th>
              <th className="p-2">Scores</th>
              <th className="p-2">Winner</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.match_date?.slice(0, 10)}</td>
                <td className="p-2">{m.venue}</td>
                <td className="p-2">{m.TeamA?.name}</td>
                <td className="p-2">{m.TeamB?.name}</td>
                <td className="p-2">
                  {m.team_a_score} - {m.team_b_score}
                </td>
                <td className="p-2">{m.Winner?.name || "-"}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => editMatch(m)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMatch(m.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No matches available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
