// src/components/UserMatchComponent.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function UserMatchComponent() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch matches
  const fetchMatches = async () => {
    try {
      const res = await API.get("/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch matches");
    }
  };

  // Fetch teams (optional if match objects already include team info)
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch teams");
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏏 Upcoming & Past Matches</h1>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Venue</th>
                <th className="p-2">Team A</th>
                <th className="p-2">Team B</th>
                <th className="p-2">Scores</th>
                <th className="p-2">Winner</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{m.match_date?.slice(0, 10)}</td>
                  <td className="p-2">{m.venue}</td>
                  <td className="p-2">{m.TeamA?.name}</td>
                  <td className="p-2">{m.TeamB?.name}</td>
                  <td className="p-2">
                    {m.team_a_score !== null && m.team_b_score !== null
                      ? `${m.team_a_score} - ${m.team_b_score}`
                      : "-"}
                  </td>
                  <td className="p-2">{m.Winner?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
