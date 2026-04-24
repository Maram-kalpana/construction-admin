import React, { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const usersData = [
  { name: "Ravi Kumar", email: "ravi@gmail.com", role: "manager" },
  { name: "Amit", email: "amit@gmail.com", role: "manager" },
  { name: "Priya Verma", email: "priya@gmail.com", role: "accountant" },
];

const emptyForm = {
  name: "",
  designation: "",
  mailId: "",
  amountAllocated: "",
  project: "",
};

function SlidePanel({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

const getProjectsFromStorage = () => {
  const savedProjects = localStorage.getItem("projectsData");
  return savedProjects ? JSON.parse(savedProjects) : [];
};

export default function Accounts() {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("accountsData");
    return saved ? JSON.parse(saved) : initialRows;
  });
  const [projectOptions, setProjectOptions] = useState(getProjectsFromStorage);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (drawerOpen) {
      setProjectOptions(getProjectsFromStorage());
    }
  }, [drawerOpen]);

  useEffect(() => {
    localStorage.setItem("accountsData", JSON.stringify(rows));
    window.dispatchEvent(new Event("dashboard-data-updated"));
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const fromMatch = fromDate ? row.date >= fromDate : true;
      const toMatch = toDate ? row.date <= toDate : true;
      return fromMatch && toMatch;
    });
  }, [rows, fromDate, toDate]);

  const totalAllocated = rows.reduce(
    (sum, row) => sum + Number(row.amountAllocated || 0),
    0
  );

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const openAllocateDrawer = () => {
    setDrawerMode("add");
    setEditingId(null);
    setFormData(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (row) => {
    setDrawerMode("edit");
    setEditingId(row.id);
    setFormData({
      name: row.name,
      designation: row.designation,
      mailId: row.mailId,
      amountAllocated: row.amountAllocated,
      project: row.project || "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Please enter name");
    if (!formData.designation) return alert("Please select designation");
    if (!formData.mailId.trim()) return alert("Please enter mail ID");
    if (!formData.amountAllocated.trim()) return alert("Please enter amount allocated");
    if (!formData.project.trim()) return alert("Please select project");

    if (drawerMode === "add") {
      const newRow = {
        id: Date.now(),
        name: formData.name,
        designation: formData.designation,
        mailId: formData.mailId,
        amountAllocated: formData.amountAllocated,
        project: formData.project,
        date: new Date().toISOString().split("T")[0],
      };

      setRows((prev) => [newRow, ...prev]);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                name: formData.name,
                designation: formData.designation,
                mailId: formData.mailId,
                amountAllocated: formData.amountAllocated,
                project: formData.project,
              }
            : row
        )
      );
    }

    closeDrawer();
  };

  const handleView = (row) => {
    navigate("/dashboard/expenses", {
      state: { person: row },
    });
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              {rows.length} account entries.
            </p>

            <button
              type="button"
              onClick={openAllocateDrawer}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition shadow-sm shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Allocate to manager
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative max-w-sm w-full">
              <label className="absolute left-4 -top-2.5 bg-background px-1 text-xs text-muted-foreground">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-10 px-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <div className="relative max-w-sm w-full">
              <label className="absolute left-4 -top-2.5 bg-background px-1 text-xs text-muted-foreground">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-10 px-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="text-sm font-medium text-foreground hover:text-primary transition"
            >
              Clear dates
            </button>
          </div>

          <div className="text-sm font-medium text-foreground">
            Current Balance: ₹{totalAllocated.toLocaleString()}
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Designation</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mail ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount Allocated</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="h-[220px] text-center align-middle text-muted-foreground">
                      No rows
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition"
                    >
                      <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{row.designation}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{row.mailId}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{row.project || "-"}</td>
                      <td className="py-3 px-4 text-foreground whitespace-nowrap">
                        ₹{Number(row.amountAllocated).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 hover:bg-green-200 transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditDrawer(row)}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 hover:bg-amber-200 transition inline-flex items-center gap-1"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 hover:bg-slate-200 transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      <SlidePanel open={drawerOpen} onClose={closeDrawer}>
        <div className="p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {drawerMode === "add" ? "Allocate to manager" : "Edit Account"}
            </h2>

            <button
              type="button"
              onClick={closeDrawer}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* DESIGNATION */}
<select
  value={formData.designation}
  onChange={(e) => {
    setFormData((prev) => ({
      ...prev,
      designation: e.target.value,
      mailId: "",
      name: "",
    }));
  }}
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
>
  <option value="">Select Designation</option>
  <option value="manager">Manager</option>
  <option value="accountant">Accountant</option>
</select>

{/* MAIL ID */}
<select
  value={formData.mailId}
  onChange={(e) => {
    const selectedEmail = e.target.value;

    const selectedUser = usersData.find(
      (u) => u.email === selectedEmail
    );

    setFormData((prev) => ({
      ...prev,
      mailId: selectedEmail,
      name: selectedUser?.name || "",
    }));
  }}
  disabled={!formData.designation}
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
>
  <option value="">Select Mail ID</option>
  {usersData
    .filter((u) => u.role === formData.designation)
    .map((user) => (
      <option key={user.email} value={user.email}>
        {user.email} ({user.name})
      </option>
    ))}
</select>

{/* NAME (AUTO FILLED) */}
<input
  type="text"
  value={formData.name}
  readOnly
  placeholder="Name"
  className="w-full h-11 rounded-2xl border border-border bg-gray-100 px-4"
/>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Project
            </label>
            <select
              value={formData.project}
              onChange={(e) => setFormData((prev) => ({ ...prev, project: e.target.value }))}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="">Select project</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <input
            type="number"
            placeholder="Amount Allocated"
            value={formData.amountAllocated}
            onChange={(e) => setFormData((prev) => ({ ...prev, amountAllocated: e.target.value }))}
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <button
            type="button"
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            {drawerMode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </SlidePanel>
    </>
  );
}