import { useEffect, useState } from "react";
import trophyAPI from "../api/trophyApi";
import teamAPI from "../api/teamApi";
import { toast } from "react-toastify";

export default function TrophyPage() {
  const [trophies, setTrophies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingTrophies, setLoadingTrophies] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [form, setForm] = useState({
    title: "",
    season: "",
    times_won: 1,
    winner_team_id: "",
  });

  useEffect(() => {
    fetchTrophies();
    fetchTeams();
  }, []);

  const fetchTrophies = async () => {
    setLoadingTrophies(true);
    try {
      const { data } = await trophyAPI.get("/");
      setTrophies(data);
    } catch (err) {
      console.error("Fetch trophies error:", err);
      toast.error("Failed to fetch trophies");
    } finally {
      setLoadingTrophies(false);
    }
  };

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const { data } = await teamAPI.get("/");
      setTeams(data);
    } catch (err) {
      console.error("Fetch teams error:", err);
      toast.error("Failed to fetch teams");
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.winner_team_id) {
      toast.warn("Please fill in all required fields");
      return;
    }
    try {
      await trophyAPI.post("/", form);
      toast.success("🏆 Trophy added");
      setForm({ title: "", season: "", times_won: 1, winner_team_id: "" });
      fetchTrophies();
    } catch (err) {
      console.error("Add trophy error:", err);
      toast.error("Failed to add trophy");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trophy?")) return;
    try {
      await trophyAPI.delete(`/${id}`);
      toast.success("Trophy deleted");
      fetchTrophies();
    } catch (err) {
      console.error("Delete trophy error:", err);
      toast.error("Failed to delete trophy");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">🏆 Manage Trophies</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Trophy Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="season"
          placeholder="Season"
          value={form.season}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="times_won"
          placeholder="Times Won"
          value={form.times_won}
          onChange={handleChange}
          min={1}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="winner_team_id"
          value={form.winner_team_id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">🏏 Select Winner Team</option>
          {loadingTeams ? (
            <option>Loading teams...</option>
          ) : (
            teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))
          )}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Trophy
        </button>
      </form>

      {loadingTrophies ? (
        <p>Loading trophies...</p>
      ) : trophies.length === 0 ? (
        <p>No trophies found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Season</th>
              <th className="border px-3 py-2">Times Won</th>
              <th className="border px-3 py-2">Winner</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trophies.map((trophy) => (
              <tr key={trophy.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{trophy.id}</td>
                <td className="border px-3 py-2">{trophy.title}</td>
                <td className="border px-3 py-2">{trophy.season}</td>
                <td className="border px-3 py-2">{trophy.times_won}</td>
                <td className="border px-3 py-2">
                  {trophy.Winner ? trophy.Winner.name : "—"}
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(trophy.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
