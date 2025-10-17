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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all matches
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch matches");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teams for dropdowns
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch teams");
    }
  };

  // Add or update match
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingId) {
        await API.put(`/matches/${editingId}`, form);
        toast.success("Match updated successfully");
      } else {
        await API.post("/matches", form);
        toast.success("Match added successfully");
      }
      resetForm();
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to save match");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete match
  const deleteMatch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      setIsLoading(true);
      await API.delete(`/matches/${id}`);
      toast.success("Match deleted successfully");
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete match");
    } finally {
      setIsLoading(false);
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

  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Match Management</h1>
                <p className="text-purple-100 text-lg">
                  Schedule and manage football matches
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2">
                  <p className="text-purple-100 text-sm">Total Matches</p>
                  <p className="text-white text-2xl font-bold">{matches.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? "Edit Match" : "Schedule New Match"}
              </h2>
              <p className="text-gray-600 text-sm">
                {editingId 
                  ? "Update match details below" 
                  : "Enter match information and teams"
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Match Date *
                  </label>
                  <input
                    type="date"
                    value={form.match_date}
                    onChange={(e) => setForm({ ...form, match_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter venue name"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team A *
                  </label>
                  <select
                    value={form.team_a_id}
                    onChange={(e) => setForm({ ...form, team_a_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Team A</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team B *
                  </label>
                  <select
                    value={form.team_b_id}
                    onChange={(e) => setForm({ ...form, team_b_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Team B</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team A Score
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.team_a_score}
                      onChange={(e) => setForm({ ...form, team_a_score: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team B Score
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.team_b_score}
                      onChange={(e) => setForm({ ...form, team_b_score: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Winner
                  </label>
                  <select
                    value={form.winner_team_id}
                    onChange={(e) => setForm({ ...form, winner_team_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="">Select Winner (Optional)</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        {editingId ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Update Match
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Schedule Match
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Matches List */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Match Schedule</h2>
              <p className="text-gray-600 text-sm">
                Overview of all scheduled matches and results
              </p>
            </div>

            {isLoading && matches.length === 0 ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches scheduled</h3>
                <p className="text-gray-500 mb-4">Get started by scheduling your first match.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Venue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matchup
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Winner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(match.match_date)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {match.venue}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 text-right">
                              <span className={`text-sm font-medium ${match.winner_team_id === match.team_a_id ? 'text-green-600' : 'text-gray-900'}`}>
                                {match.TeamA?.name || getTeamName(match.team_a_id)}
                              </span>
                            </div>
                            <div className="text-gray-400 mx-2">vs</div>
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${match.winner_team_id === match.team_b_id ? 'text-green-600' : 'text-gray-900'}`}>
                                {match.TeamB?.name || getTeamName(match.team_b_id)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            {match.team_a_score !== null && match.team_b_score !== null ? (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {match.team_a_score} - {match.team_b_score}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not played</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {match.Winner ? (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {match.Winner.name}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editMatch(match)}
                              className="inline-flex items-center px-3 py-1.5 border border-yellow-400 text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => deleteMatch(match.id)}
                              disabled={isLoading}
                              className="inline-flex items-center px-3 py-1.5 border border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors duration-200 text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}