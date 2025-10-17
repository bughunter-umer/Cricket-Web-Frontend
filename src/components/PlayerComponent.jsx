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
  const [isLoading, setIsLoading] = useState(false);
  const [activeTransfer, setActiveTransfer] = useState(null);

  // Fetch all players
  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/players");
      setPlayers(res.data);
    } catch (err) {
      toast.error("Failed to fetch players");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all teams (for dropdowns)
  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      toast.error("Failed to fetch teams");
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
      setIsLoading(true);
      if (editId) {
        await API.put(`/players/${editId}`, form);
        toast.success("Player updated successfully");
      } else {
        await API.post("/players", form);
        toast.success("Player added successfully");
      }
      setForm({ name: "", role: "", base_price: "", current_price: "", teamId: "" });
      setEditId(null);
      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save player");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete player
  const deletePlayer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      setIsLoading(true);
      await API.delete(`/players/${id}`);
      toast.success("Player deleted successfully");
      fetchPlayers();
    } catch (err) {
      toast.error("Failed to delete player");
    } finally {
      setIsLoading(false);
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
    setActiveTransfer(null);
  };

  // Transfer player
  const transferPlayer = async (id) => {
    if (!transferData.to_team_id || !transferData.price) {
      toast.error("Please select a team and enter transfer price");
      return;
    }
    
    try {
      setIsLoading(true);
      await API.post(`/players/${id}/transfer`, transferData);
      toast.success("Player transferred successfully");
      setTransferData({ to_team_id: "", price: "" });
      setActiveTransfer(null);
      fetchPlayers();
    } catch (err) {
      toast.error("Failed to transfer player");
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get role badge color
  const getRoleColor = (role) => {
    const roleColors = {
      'Batsman': 'bg-red-100 text-red-800',
      'Bowler': 'bg-blue-100 text-blue-800',
      'All-rounder': 'bg-green-100 text-green-800',
      'Wicket-keeper': 'bg-purple-100 text-purple-800',
      'Captain': 'bg-yellow-100 text-yellow-800',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Player Management</h1>
                <p className="text-orange-100 text-lg">
                  Manage player roster, contracts, and transfers
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-orange-500/20 rounded-lg px-4 py-2">
                  <p className="text-orange-100 text-sm">Total Players</p>
                  <p className="text-white text-2xl font-bold">{players.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editId ? "Edit Player" : "Add New Player"}
              </h2>
              <p className="text-gray-600 text-sm">
                {editId 
                  ? "Update player details below" 
                  : "Enter new player information and contract details"
                }
              </p>
            </div>
            
            <form onSubmit={savePlayer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter player name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    <option value="">Select Role</option>
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicket-keeper">Wicket-keeper</option>
                    <option value="Captain">Captain</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team
                  </label>
                  <select
                    value={form.teamId}
                    onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    <option value="">Select Team (Optional)</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.base_price}
                        onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.current_price}
                        onChange={(e) => setForm({ ...form, current_price: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                        {editId ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Update Player
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Player
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ name: "", role: "", base_price: "", current_price: "", teamId: "" });
                        setEditId(null);
                        setActiveTransfer(null);
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Players List */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Player Roster</h2>
              <p className="text-gray-600 text-sm">
                Overview of all players and their contract details
              </p>
            </div>

            {isLoading && players.length === 0 ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading players...</p>
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first player.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {player.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{player.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {player.role && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(player.role)}`}>
                              {player.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <div className="text-gray-600">
                              Base: <span className="font-medium text-gray-900">{formatCurrency(player.base_price)}</span>
                            </div>
                            <div className="text-gray-600">
                              Current: <span className="font-medium text-green-600">{formatCurrency(player.current_price)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {player.Team ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                {player.Team.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{player.Team.name}</div>
                                <div className="text-xs text-gray-500">{player.Team.city}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editPlayer(player)}
                                className="inline-flex items-center px-3 py-1.5 border border-yellow-400 text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => deletePlayer(player.id)}
                                disabled={isLoading}
                                className="inline-flex items-center px-3 py-1.5 border border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors duration-200 text-sm"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                            
                            {/* Transfer Section */}
                            <div className="border-t pt-2">
                              <button
                                onClick={() => setActiveTransfer(activeTransfer === player.id ? null : player.id)}
                                className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Transfer Player
                              </button>
                              
                              {activeTransfer === player.id && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="grid grid-cols-2 gap-2 mb-2">
                                    <select
                                      value={transferData.to_team_id}
                                      onChange={(e) => setTransferData({ ...transferData, to_team_id: e.target.value })}
                                      className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                    >
                                      <option value="">Select Team</option>
                                      {teams.filter(t => t.id !== player.teamId).map((t) => (
                                        <option key={t.id} value={t.id}>
                                          {t.name}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm">$</span>
                                      </div>
                                      <input
                                        type="number"
                                        placeholder="Price"
                                        value={transferData.price}
                                        onChange={(e) => setTransferData({ ...transferData, price: e.target.value })}
                                        className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => transferPlayer(player.id)}
                                    disabled={isLoading}
                                    className="w-full inline-flex items-center justify-center px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs rounded transition-colors duration-200"
                                  >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Confirm Transfer
                                  </button>
                                </div>
                              )}
                            </div>
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