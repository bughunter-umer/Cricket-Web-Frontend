import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function InvestorComponent() {
  const [investors, setInvestors] = useState([]);
  const [form, setForm] = useState({ name: "", contribution: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchInvestors = async () => {
    try {
      const res = await API.get("/investors");
      setInvestors(res.data);
    } catch (err) {
      toast.error("Failed to fetch investors");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/investors/${editingId}`, {
          ...form,
          contribution: parseFloat(form.contribution),
        });
        toast.success("Investor updated successfully!");
      } else {
        await API.post("/investors", {
          ...form,
          contribution: parseFloat(form.contribution),
        });
        toast.success("Investor added successfully!");
      }
      setForm({ name: "", contribution: "" });
      setEditingId(null);
      fetchInvestors();
    } catch (err) {
      toast.error("Error saving investor");
      console.error(err);
    }
  };

  const handleEdit = (inv) => {
    setForm({ name: inv.name, contribution: inv.contribution });
    setEditingId(inv.id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/investors/${id}`);
      toast.success("Investor deleted!");
      fetchInvestors();
    } catch (err) {
      toast.error("Error deleting investor");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investors</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contribution</label>
          <input
            type="number"
            value={form.contribution}
            onChange={(e) =>
              setForm({ ...form, contribution: e.target.value })
            }
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Investor List */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Contribution</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((inv) => (
            <tr key={inv.id} className="text-center">
              <td className="p-2 border">{inv.id}</td>
              <td className="p-2 border">{inv.name}</td>
              <td className="p-2 border">{inv.contribution}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(inv)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {investors.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-gray-500">
                No investors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
