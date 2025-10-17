// src/components/RevenueComponent.jsx
import { useEffect, useState } from "react";
import API from "../api"; // Axios instance with baseURL
import { toast } from "react-toastify";

export default function RevenueComponent() {
  const [revenues, setRevenues] = useState([]);
  const [form, setForm] = useState({ source: "", amount: "" });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch revenues
  const fetchRevenues = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/revenues");
      setRevenues(res.data);
    } catch (err) {
      toast.error("Failed to fetch revenues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  // Add or update revenue
  const saveRevenue = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editId) {
        await API.put(`/revenues/${editId}`, form);
        toast.success("Revenue updated successfully");
      } else {
        await API.post("/revenues", form);
        toast.success("Revenue added successfully");
      }
      setForm({ source: "", amount: "" });
      setEditId(null);
      fetchRevenues();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save revenue");
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      await API.delete(`/revenues/${id}`);
      toast.success("Revenue deleted successfully");
      fetchRevenues();
    } catch (err) {
      toast.error("Failed to delete revenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total revenue
  const totalRevenue = revenues.reduce((sum, rev) => sum + parseFloat(rev.amount || 0), 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get source icon
  const getSourceIcon = (source) => {
    const icons = {
      'Ticket Sales': '🎫',
      'Sponsorship': '🤝',
      'Merchandise': '👕',
      'Broadcasting': '📺',
      'Advertising': '📢',
      'Partnership': '🤲',
      'Licensing': '📄',
      'Other': '💰'
    };
    
    const matchedKey = Object.keys(icons).find(key => 
      source.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? icons[matchedKey] : '💰';
  };

  // Get source color
  const getSourceColor = (source) => {
    const colors = {
      'Ticket Sales': 'bg-blue-100 text-blue-800',
      'Sponsorship': 'bg-green-100 text-green-800',
      'Merchandise': 'bg-purple-100 text-purple-800',
      'Broadcasting': 'bg-orange-100 text-orange-800',
      'Advertising': 'bg-red-100 text-red-800',
      'Partnership': 'bg-indigo-100 text-indigo-800',
      'Licensing': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    
    const matchedKey = Object.keys(colors).find(key => 
      source.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? colors[matchedKey] : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Revenue Management</h1>
                <p className="text-teal-100 text-lg">
                  Track and manage all revenue streams
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-teal-500/20 rounded-lg px-4 py-2">
                  <p className="text-teal-100 text-sm">Total Revenue</p>
                  <p className="text-white text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editId ? "Edit Revenue" : "Add New Revenue"}
              </h2>
              <p className="text-gray-600 text-sm">
                {editId 
                  ? "Update revenue details below" 
                  : "Enter new revenue source and amount"
                }
              </p>
            </div>
            
            <form onSubmit={saveRevenue} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Source *
                </label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                  required
                >
                  <option value="">Select Revenue Source</option>
                  <option value="Ticket Sales">Ticket Sales</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Broadcasting">Broadcasting Rights</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Licensing">Licensing</option>
                  <option value="Other">Other</option>
                </select>
                {form.source === "Other" && (
                  <input
                    type="text"
                    placeholder="Specify revenue source"
                    value={form.source === "Other" ? form.source : ""}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                            Update Revenue
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Revenue
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ source: "", amount: "" });
                        setEditId(null);
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

          {/* Revenue List */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Revenue Streams</h2>
                <p className="text-gray-600 text-sm">
                  Overview of all revenue sources and amounts
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="bg-teal-50 rounded-lg px-4 py-2 border border-teal-200">
                  <p className="text-teal-700 text-sm font-medium">Total Revenue Sources</p>
                  <p className="text-teal-900 text-lg font-bold">{revenues.length}</p>
                </div>
              </div>
            </div>

            {isLoading && revenues.length === 0 ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading revenues...</p>
              </div>
            ) : revenues.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No revenue streams found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first revenue source.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenues.map((rev) => {
                      const percentage = totalRevenue > 0 ? (parseFloat(rev.amount) / totalRevenue * 100) : 0;
                      return (
                        <tr key={rev.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg">
                                {getSourceIcon(rev.source)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {rev.source}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: #{rev.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(parseFloat(rev.amount))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-teal-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editRevenue(rev)}
                                className="inline-flex items-center px-3 py-1.5 border border-yellow-400 text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => deleteRevenue(rev.id)}
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
                      );
                    })}
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