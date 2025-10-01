// src/components/PlayerComponent.jsx
import { useEffect, useState } from "react";
import API from "../api"; // Axios instance with baseURL
import { toast } from "react-toastify";

export default function PlayerComponent() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    base_price: "",
    current_price: "",
    teamId: "",
  });
  const [editId, setEditId] = useState(null);
  const [transferData, setTransferData] = useState({
    to_team_id: "",
    price: "",
  });

  // Fetch all players
  const fetchPlayers = async () => {
    try {
      const res = await API.get("/players");
      setPlayers(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch players");
    }
  };

  // Fetch all teams (for dropdowns)
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch teams");
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  // Add or update player
  const savePlayer = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/players/${editId}`, form);
        toast.success("✅ Player updated");
      } else {
        await API.post("/players", form);
        toast.success("✅ Player added");
      }
      setForm({ name: "", role: "", base_price: "", current_price: "", teamId: "" });
      setEditId(null);
      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to save player");
    }
  };

  // Delete player
  const deletePlayer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await API.delete(`/players/${id}`);
      toast.success("🗑️ Player deleted");
      fetchPlayers();
    } catch (err) {
      toast.error("❌ Failed to delete player");
    }
  };

  // Edit player
  const editPlayer = (player) => {
    setForm({
      name: player.name,
      role: player.role,
      base_price: player.base_price,
      current_price: player.current_price,
      teamId: player.teamId || "",
    });
    setEditId(player.id);
  };

  // Transfer player
  const transferPlayer = async (id) => {
    try {
      await API.post(`/players/${id}/transfer`, transferData);
      toast.success("🔄 Player transferred");
      setTransferData({ to_team_id: "", price: "" });
      fetchPlayers();
    } catch (err) {
      toast.error("❌ Failed to transfer player");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">⚡ Player Management</h1>

      {/* Player Form */}
      <form onSubmit={savePlayer} className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Role (Batsman, Bowler, etc)"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Base Price"
          value={form.base_price}
          onChange={(e) => setForm({ ...form, base_price: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Current Price"
          value={form.current_price}
          onChange={(e) => setForm({ ...form, current_price: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={form.teamId}
          onChange={(e) => setForm({ ...form, teamId: e.target.value })}
          className="border p-2 rounded col-span-2"
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.city})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 col-span-2"
        >
          {editId ? "Update Player" : "Add Player"}
        </button>
      </form>

      {/* Players List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">📋 Players List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Base Price</th>
              <th className="p-2 border">Current Price</th>
              <th className="p-2 border">Team</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="text-center border-t">
                <td className="p-2 border">{player.name}</td>
                <td className="p-2 border">{player.role}</td>
                <td className="p-2 border">${player.base_price}</td>
                <td className="p-2 border">${player.current_price}</td>
                <td className="p-2 border">{player.Team ? player.Team.name : "Unassigned"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => editPlayer(player)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                  <div className="flex gap-2 mt-2">
                    <select
                      value={transferData.to_team_id}
                      onChange={(e) => setTransferData({ ...transferData, to_team_id: e.target.value })}
                      className="border p-1 rounded"
                    >
                      <option value="">Transfer To</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={transferData.price}
                      onChange={(e) => setTransferData({ ...transferData, price: e.target.value })}
                      className="border p-1 rounded w-24"
                    />
                    <button
                      onClick={() => transferPlayer(player.id)}
                      className="bg-green-500 px-2 py-1 rounded text-white"
                    >
                      Transfer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
