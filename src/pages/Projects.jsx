import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react"; // 👈 Yahan se 'Calendar' hata diya hai
import AdminLayout from "../components/AdminLayout";

const initialProjectData = [
  {
    id: 1,
    name: "Project Alpha",
    manager: "Site Manager",
    startDate: "2026-01-15",
    location: "Hyderabad",
    budget: "₹5L",
    status: "Active",
  },
  {
    id: 2,
    name: "Project Beta",
    manager: "Project Manager",
    startDate: "2026-02-10",
    location: "Bangalore",
    budget: "₹8L",
    status: "Pending",
  },
  {
    id: 3,
    name: "Project Gamma",
    manager: "Supervisor",
    startDate: "2026-03-05",
    location: "Chennai",
    budget: "₹6L",
    status: "Inactive",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-600",
  Inactive: "bg-red-100 text-red-600",
  Pending: "bg-amber-100 text-amber-600",
};

function SlidePanel({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[370px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

const Projects = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projectsData");
    return saved ? JSON.parse(saved) : initialProjectData;
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    manager: "",
    location: "",
    startDate: "",
    budget: "",
    status: "Active",
  });

  useEffect(() => {
    localStorage.setItem("projectsData", JSON.stringify(projects));
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = filter === "All" ? true : project.status === filter;
      const q = search.toLowerCase();

      const matchesSearch =
        project.name.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.manager.toLowerCase().includes(q) ||
        project.startDate.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  const resetForm = () => {
    setForm({
      name: "",
      manager: "",
      location: "",
      startDate: "",
      budget: "",
      status: "Active",
    });
  };

  const handleAddProject = () => {
    if (!form.name.trim()) return alert("Please enter project name");
    if (!form.manager.trim()) return alert("Please assign manager");
    if (!form.location.trim()) return alert("Please enter location");
    if (!form.startDate) return alert("Please select start date");
    if (!form.budget.trim()) return alert("Please enter budget");

    const newProject = {
      id: Date.now(),
      name: form.name,
      manager: form.manager,
      startDate: form.startDate,
      location: form.location,
      budget: form.budget,
      status: form.status,
    };

    setProjects((prev) => [...prev, newProject]);
    setOpenAddPanel(false);
    resetForm();
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      manager: project.manager,
      location: project.location,
      startDate: project.startDate,
      budget: project.budget,
      status: project.status,
    });
    setOpenEditPanel(true);
  };

  const handleUpdateProject = () => {
    if (!form.name.trim()) return alert("Please enter project name");
    if (!form.manager.trim()) return alert("Please assign manager");
    if (!form.location.trim()) return alert("Please enter location");
    if (!form.startDate) return alert("Please select start date");
    if (!form.budget.trim()) return alert("Please enter budget");

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingId
          ? {
              ...project,
              name: form.name,
              manager: form.manager,
              location: form.location,
              startDate: form.startDate,
              budget: form.budget,
              status: form.status,
            }
          : project
      )
    );

    setOpenEditPanel(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              {projects.length} total construction projects.
            </p>

            <button
              onClick={() => {
                resetForm();
                setOpenAddPanel(true);
              }}
              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search project..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            {/* 👇 YAHAN SE 'Pending' HATA DIYA HAI */}
            {["All", "Active", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`h-10 px-5 rounded-2xl text-sm font-semibold transition ${
                  filter === s
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-transparent text-foreground hover:bg-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Project Name
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Manager
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Start date
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Budget
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-4 px-5 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition"
                  >
                    <td className="py-4 px-5 font-medium text-foreground">
                      {project.name}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      {project.manager}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      {project.startDate}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      {project.location}
                    </td>
                    <td className="py-4 px-5 font-medium text-foreground">
                      {project.budget}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => handleEditClick(project)} className="transition">
                          <Pencil className="w-4 h-4 text-emerald-700" />
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)} className="transition">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-muted-foreground">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      {/* ====== ADD PROJECT PANEL ====== */}
      <SlidePanel open={openAddPanel} onClose={() => setOpenAddPanel(false)}>
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center justify-between px-6 pt-8 pb-5">
            <h2 className="text-2xl font-heading font-bold text-foreground">Add Project</h2>
            <button
              onClick={() => setOpenAddPanel(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="px-6 space-y-4">
            <input
              type="text"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />

            <div className="relative">
              <select
                value={form.manager}
                onChange={(e) => setForm((prev) => ({ ...prev, manager: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Assign manager</option>
                <option value="Site Manager">Site Manager</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Supervisor">Supervisor</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* 👇 EXTRA ICON REMOVED FROM ADD PANEL */}
            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>

            <input
              type="text"
              placeholder="Budget"
              value={form.budget}
              onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <button
              onClick={handleAddProject}
              className="w-full h-12 mt-4 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
            >
              Add Project
            </button>
          </div>
        </div>
      </SlidePanel>

      {/* ====== EDIT PROJECT PANEL ====== */}
      <SlidePanel open={openEditPanel} onClose={() => setOpenEditPanel(false)}>
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center justify-between px-6 pt-8 pb-5">
            <h2 className="text-2xl font-heading font-bold text-foreground">Edit Project</h2>
            <button
              onClick={() => setOpenEditPanel(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="px-6 space-y-4">
            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Project Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Assign manager
              </label>
              <select
                value={form.manager}
                onChange={(e) => setForm((prev) => ({ ...prev, manager: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Site Manager">Site Manager</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Supervisor">Supervisor</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* 👇 EXTRA ICON REMOVED FROM EDIT PANEL */}
            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Budget
              </label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <button
              onClick={handleUpdateProject}
              className="w-full h-12 mt-4 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
            >
              Update Project
            </button>
          </div>
        </div>
      </SlidePanel>
    </>
  );
};

export default Projects;