import { useState, useEffect } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../components/AdminLayout";
import {
  getVendors,
  addVendorApi,
  updateVendorApi,
  deleteVendorApi,
} from "../api/projectApi";

const cardColors = [
  { bgClass: "bg-[#EFF6FF] dark:bg-[#0B1727]", iconClass: "text-[#3B82F6]" },
  { bgClass: "bg-[#F5F3FF] dark:bg-[#131128]", iconClass: "text-[#A855F7]" },
  { bgClass: "bg-[#F0FDF4] dark:bg-[#0A1A17]", iconClass: "text-[#22C55E]" },
  { bgClass: "bg-[#FFFBEB] dark:bg-[#1E1410]", iconClass: "text-[#F59E0B]" },
];

export default function Vendor() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);

  // 🔥 NEW STATES
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    notes: "",
    type: "labour",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      console.log("VENDORS API 👉", res.data);
      setVendors(res.data.data || []);
    } catch (error) {
      console.error("VENDOR FETCH ERROR ❌", error);
    }
  };

  // 🔥 ADD / UPDATE
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        contact: form.contact,
        notes: form.notes,
        type: [form.type],
      };

      if (editId) {
        await updateVendorApi(editId, payload);
        alert("Vendor Updated ✅");
      } else {
        await addVendorApi(payload);
        alert("Vendor Added ✅");
      }

      setShowModal(false);
      setEditId(null);
      setForm({ name: "", contact: "", notes: "", type: "labour" });

      fetchVendors();
    } catch (error) {
      console.error("SAVE ERROR ❌", error.response?.data);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    try {
      await deleteVendorApi(id);
      alert("Deleted ✅");
      fetchVendors();
    } catch (error) {
      console.error("DELETE ERROR ❌", error.response?.data);
    }
  };

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.name || "").toLowerCase().includes(q) ||
      (v.type?.[0] || "").toLowerCase().includes(q)
    );
  });

  const getInitials = (name) => {
    if (!name) return "V";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm text-muted-foreground">
          {vendors.length} vendor accounts
        </p>

        {/* 🔥 ADD BUTTON */}
        <button
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Vendor
        </button>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full h-10 pl-10 pr-4 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vendor, index) => {
            const colorConfig = cardColors[index % cardColors.length];

            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-5 ${colorConfig.bgClass}`}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorConfig.iconClass}`}>
                      {getInitials(vendor.name)}
                    </div>
                    <div>
                      <h3>{vendor.name}</h3>
                      <p>{(vendor.type?.[0] || "N/A") + " Vendor"}</p>
                    </div>
                  </div>
                  <span className="text-green-500 text-xs">Active</span>
                </div>

                <div className="space-y-1 mb-3 text-sm">
                  <div className="flex gap-2"><Mail size={14} /> N/A</div>
                  <div className="flex gap-2"><Phone size={14} /> {vendor.contact}</div>
                  <div className="flex gap-2"><MapPin size={14} /> {vendor.notes || "N/A"}</div>
                </div>

                {/* 🔥 ACTION BUTTONS */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditId(vendor.id);
                      setForm({
                        name: vendor.name,
                        contact: vendor.contact,
                        notes: vendor.notes,
                        type: vendor.type?.[0] || "labour",
                      });
                      setShowModal(true);
                    }}
                  >
                    ✏️
                  </button>

                  <button onClick={() => handleDelete(vendor.id)}>
                    🗑
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="mb-4">
              {editId ? "Edit Vendor" : "Add Vendor"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <input
                placeholder="Name"
                className="w-full border p-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Contact"
                className="w-full border p-2"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              <input
                placeholder="Notes"
                className="w-full border p-2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />

              <select
                className="w-full border p-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="labour">Labour</option>
                <option value="material">Material</option>
                <option value="machinery">Machinery</option>
              </select>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}