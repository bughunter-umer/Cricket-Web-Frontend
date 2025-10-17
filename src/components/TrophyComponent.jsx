import { useEffect, useState } from "react";
import trophyAPI from "../api/trophyApi";
import teamAPI from "../api/teamApi";
import { toast } from "react-toastify";

export default function TrophyPage() {
  const [trophies, setTrophies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingTrophies, setLoadingTrophies] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await trophyAPI.get("/");
      // Handle both response formats
      const trophiesData = response.data?.data || response.data || [];
      setTrophies(trophiesData);
    } catch (err) {
      console.error("Fetch trophies error:", err);
      toast.error("Failed to fetch trophies");
      setTrophies([]);
    } finally {
      setLoadingTrophies(false);
    }
  };

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await teamAPI.get("/");
      // Handle both response formats
      const teamsData = response.data?.data || response.data || [];
      setTeams(teamsData);
    } catch (err) {
      console.error("Fetch teams error:", err);
      toast.error("Failed to fetch teams");
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'times_won' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.winner_team_id) {
      toast.warn("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await trophyAPI.post("/", form);
      toast.success("🏆 Trophy added successfully!");
      setForm({ title: "", season: "", times_won: 1, winner_team_id: "" });
      fetchTrophies();
    } catch (err) {
      console.error("Add trophy error:", err);
      const errorMessage = err.response?.data?.error || "Failed to add trophy";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trophy?")) return;
    
    try {
      await trophyAPI.delete(`/${id}`);
      toast.success("Trophy deleted successfully!");
      fetchTrophies();
    } catch (err) {
      console.error("Delete trophy error:", err);
      const errorMessage = err.response?.data?.error || "Failed to delete trophy";
      toast.error(errorMessage);
    }
  };

  // Get current year for season placeholder
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-yellow-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Trophy Management</h1>
                <p className="text-amber-100 text-lg">
                  Manage tournament trophies and winners
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-amber-500/20 rounded-lg px-4 py-2">
                  <p className="text-amber-100 text-sm">Total Trophies</p>
                  <p className="text-white text-2xl font-bold">{trophies.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Trophy
              </h2>
              <p className="text-gray-600 text-sm">
                Enter trophy details and select the winning team
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trophy Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., World Cup, Champions Trophy"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season
                  </label>
                  <input
                    type="text"
                    name="season"
                    placeholder={`e.g., ${currentYear}-${currentYear + 1}`}
                    value={form.season}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Winning Team *
                  </label>
                  <select
                    name="winner_team_id"
                    value={form.winner_team_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="">Select Winning Team</option>
                    {loadingTeams ? (
                      <option disabled>Loading teams...</option>
                    ) : (
                      teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} {team.city ? `(${team.city})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Times Won
                  </label>
                  <input
                    type="number"
                    name="times_won"
                    placeholder="1"
                    value={form.times_won}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || loadingTeams}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Trophy...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Trophy
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Trophies List */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Trophy History</h2>
              <p className="text-gray-600 text-sm">
                Overview of all tournament trophies and their winners
              </p>
            </div>

            {loadingTrophies ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-amber-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading trophies...</p>
              </div>
            ) : trophies.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trophies found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first trophy.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trophy
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Season
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Times Won
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
                    {trophies.map((trophy) => (
                      <tr key={trophy.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {trophy.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{trophy.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {trophy.season || (
                              <span className="text-gray-400">Not specified</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {trophy.times_won} time{trophy.times_won !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {trophy.Winner ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                {trophy.Winner.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{trophy.Winner.name}</div>
                                {trophy.Winner.city && (
                                  <div className="text-xs text-gray-500">{trophy.Winner.city}</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(trophy.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
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