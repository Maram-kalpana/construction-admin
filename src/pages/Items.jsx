import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, ChevronDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const dummyItems = [
  { id: 1, type: "Material", name: "Cement" },
  { id: 2, type: "Machinery", name: "Excavator" },
];

export default function Items() {
  const [search, setSearch] = useState("");
 const [items, setItems] = useState(() => {
  const saved = localStorage.getItem("itemsData");
  return saved ? JSON.parse(saved) : dummyItems;
});
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type: "Material", name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.type.trim() || !form.name.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form } : item
        )
      );
      alert("Item Updated ✅");
    } else {
      const newItem = { id: Date.now(), ...form };
      setItems((prev) => [...prev, newItem]);
      alert("Item Added ✅");
    }

    setShowModal(false);
    setEditId(null);
    setForm({ type: "Material", name: "" });
  };  

  useEffect(() => {
  localStorage.setItem("itemsData", JSON.stringify(items));
}, [items]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted ✅");
    }
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(q) ||
      (item.type || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xl font-semibold">
            Items
          </p>
          <button
            onClick={() => { setEditId(null); setForm({ type: "Material", name: "" }); setShowModal(true); }}
            className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25 whitespace-nowrap"
          >
            + Add Item
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative flex-shrink-0 w-full sm:w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search items..."
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>

        {/* TABLE */}
        <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-secondary/50">
              <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-r border-border">Type</th>
<th className="py-3 px-4 font-semibold text-foreground text-center border-b border-r border-border">Item Name</th>
<th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/30 transition">
               <td className="py-3 px-4 border-b border-r border-border text-center">{item.type}</td>
<td className="py-3 px-4 border-b border-r border-border text-center">{item.name}</td>
                  <td className="py-3 px-4 border-b border-border text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button onClick={() => { setEditId(item.id); setForm({ type: item.type, name: item.name }); setShowModal(true); }}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr><td colSpan="3" className="py-10 text-center text-muted-foreground">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 py-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-muted-foreground font-medium">
            Page {currentPage} of {totalPages || 1}
          </p>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* MODAL */}
               {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex flex-col sm:flex-row">

            <div
              className="flex-1 bg-black/40"
              onClick={() => setShowModal(false)}
            />

            <div className="w-full sm:max-w-md bg-card h-auto sm:h-full shadow-xl p-7 animate-slideIn">
  <h2 className="text-2xl font-bold text-foreground mb-6">
    {editId ? "Edit Item" : "Add Item"}
  </h2>

              <form onSubmit={handleSave} className="space-y-5">

                {/* TYPE */}
               <div className="relative">
  <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
    Type
  </label>
  <select
    value={form.type}
    onChange={(e) => setForm({ ...form, type: e.target.value })}
    className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
  >
    <option value="Material">Material</option>
    <option value="Machinery">Machinery</option>
  </select>
  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
</div>

                {/* NAME */}
               <input
  placeholder="Item Name"
  className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
  value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
/>
<button className="w-full h-12 rounded-2xl bg-primary text-white font-semibold hover:opacity-90 transition">
  {editId ? "Update" : "Save"}
</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}