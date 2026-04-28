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
  type: [], 
});
const [showTypeDropdown, setShowTypeDropdown] = useState(false);
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
        type: form.type,
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
  <div className="space-y-4">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Vendors</h2>

      <button
        onClick={() => {
          setEditId(null);
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Vendor
      </button>
    </div>

    {/* SEARCH */}
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vendors..."
        className="w-full h-10 pl-10 pr-4 border rounded-lg"
      />
    </div>

    {/* TABLE */}
    <div className="border rounded-xl overflow-hidden">
      <div className="border rounded-xl overflow-hidden">
  <table className="w-full table-fixed border-collapse">

    {/* HEADER */}
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="p-3 w-[20%] border-b border-border border-r border-border">
          Type
        </th>

        <th className="p-3 w-[35%] border-b border-border border-r border-border">
          Name
        </th>

        <th className="p-3 w-[30%] border-b border-border border-r border-border">
          Contact
        </th>

        <th className="p-3 w-[15%] text-right pr-8 border-b border-border">
          Actions
        </th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filtered.map((vendor) => (
        <tr key={vendor.id}>
          
          <td className="p-3 border-b border-border border-r border-border capitalize">
            {vendor.type?.[0]}
          </td>

          <td className="p-3 border-b border-border border-r border-border">
            {vendor.name}
          </td>

          <td className="p-3 border-b border-border border-r border-border">
            {vendor.contact}
          </td>

          <td className="p-3 border-b border-border pr-8">
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditId(vendor.id);
                  setForm({
                    name: vendor.name,
                    contact: vendor.contact,
                    notes: vendor.notes,
                    type: vendor.type || [],
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
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex">

        <div
          className="flex-1 bg-black/40"
          onClick={() => setShowModal(false)}
        />

        <div className="w-full max-w-md bg-white h-full shadow-xl p-6 animate-slideIn">

          <h2 className="text-2xl font-semibold mb-6">
            {editId ? "Edit vendor" : "Add vendor"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">

            {/* TYPE */}
            <div className="relative">
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full h-14 border rounded-2xl px-4 flex items-center justify-between cursor-pointer"
              >
                <span className="text-gray-600">
                  {form.type.length > 0
                    ? form.type.join(", ")
                    : "Select Type"}
                </span>
                <span>⌄</span>
              </div>

              {showTypeDropdown && (
                <div className="absolute top-16 w-full bg-white border rounded-xl shadow-md z-10">
                  {["labour", "material", "machinery"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.type.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              type: [...form.type, item],
                            });
                          } else {
                            setForm({
                              ...form,
                              type: form.type.filter((t) => t !== item),
                            });
                          }
                        }}
                      />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* NAME */}
            <input
              placeholder="Name"
              className="w-full h-14 border rounded-2xl px-4"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* CONTACT */}
            <input
              placeholder="Contact"
              className="w-full h-14 border rounded-2xl px-4"
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg mt-4">
              Save
            </button>
          </form>
        </div>
      </div>
    )}

  </div>
</AdminLayout>
);
}