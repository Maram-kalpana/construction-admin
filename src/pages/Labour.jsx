import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Filter,
  EyeOff,
  Columns3,
  X,
  Search,
  Check,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getReports } from "../api/reportApi";
import { getProjects } from "../api/projectApi";

const defaultColumns = [
  { key: "date", label: "Date", visible: true },
  { key: "party", label: "Party", visible: true },
  { key: "m", label: "M", visible: true },
  { key: "f", label: "F", visible: true },
  { key: "workDone", label: "Work done", visible: true },
  { key: "measurements", label: "Measurements", visible: true },
];

const dummyProjects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
];

const dummyLabourData = [
  { id: 1, project: "Project Alpha", date: "2025-04-10", party: "Labour Team A", m: 12, f: 4, workDone: "Brick masonry", measurements: "120 sq ft" },
  { id: 2, project: "Project Alpha", date: "2025-04-11", party: "Labour Team B", m: 8, f: 3, workDone: "Plastering", measurements: "85 sq ft" },
  { id: 3, project: "Project Alpha", date: "2025-04-12", party: "Labour Team C", m: 10, f: 2, workDone: "Shuttering", measurements: "60 sq ft" },
];

export default function Labour() {
  
  const [rows, setRows] = useState([]);
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [columns, setColumns] = useState(defaultColumns);

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterState, setFilterState] = useState({ column: "date", operator: "contains", value: "" });

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
  fetchProjects();
  fetchReports();
}, []);

const fetchProjects = async () => {
  try {
    const res = await getProjects();

    console.log("ADMIN PROJECTS:", res.data);
    console.log("REPORTS RAW:", res);
console.log("REPORTS DATA:", res.data);

    const data = Array.isArray(res.data?.data)
  ? res.data.data
  : Array.isArray(res.data)
  ? res.data
  : [];

    setProjects(data);

  } catch (err) {
    console.log("Project fetch error:", err);
  }
};


const fetchReports = async () => {
  try {
    const res = await getReports();

    console.log("REPORTS:", res.data);

    const data = res?.data?.data || [];
 
    // 🔥 MAP API → TABLE FORMAT
    const formatted = data.map((item) => ({
  id: item.id,
  date: item.date,
  party: item.vendor_id,
  m: item.mason,
  f: item.female_unskilled,
  workDone: item.work_done,
  measurements: "-",
}));

    setRows(formatted);

  } catch (err) {
    console.log("Error fetching reports:", err);
  }
};
  const filteredRows = rows;
  const visibleColumns = columns.filter((col) => col.visible);

  const searchedColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const toggleColumn = (key) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)));
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumns((prev) => prev.map((col) => ({ ...col, visible: !allVisible })));
  };

  const resetColumns = () => setColumns(defaultColumns);

  const openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  // Check if any dropdown is open to expand container height dynamically
  const isAnyMenuOpen = headerMenuOpen || showManageColumns;

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Data comes from manager daily reports.
        </p>

        {/* UPAR WALA BOX */}
        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
  {item.name || item.projectName}
</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[185px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* NICHE WALA BOX (Now with perfect rounded corners like the top box) */}
        <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden relative">
          <div className={`overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isAnyMenuOpen ? 'min-h-[480px]' : ''}`}>
            <table className="w-full text-sm border border-border border-collapse">
              <thead>
                <tr className="border-b border-border bg-card">
                  {visibleColumns.map((col) => {
                    const isSorted = sortConfig.key === col.key;
                    const isAsc = isSorted && sortConfig.direction === "asc";
                    const isDesc = isSorted && sortConfig.direction === "desc";

                    return (
                    <th className="border border-border px-4 py-4 text-left font-semibold whitespace-nowrap">
  {col.label}
</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {showFilterRow && (
                  <tr className="border-b border-border">
                    <td className="border border-border px-4 py-3 whitespace-nowrap">
                      <div className="max-w-[660px] rounded-2xl bg-card shadow-xl border border-border p-5 flex items-center gap-4">
                        <button type="button" onClick={() => setShowFilterRow(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition">
                          <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <div className="relative min-w-[170px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Columns</label>
                          <select value={filterState.column} onChange={(e) => setFilterState((prev) => ({ ...prev, column: e.target.value }))} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none">
                            {columns.map((col) => <option key={col.key} value={col.key}>{col.label}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="relative min-w-[170px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Operator</label>
                          <select value={filterState.operator} onChange={(e) => setFilterState((prev) => ({ ...prev, operator: e.target.value }))} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none">
                            <option value="contains">contains</option>
                            <option value="does not contain">does not contain</option>
                            <option value="equals">equals</option>
                            <option value="does not equal">does not equal</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="relative flex-1 min-w-[210px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Value</label>
                          <input type="text" value={filterState.value} onChange={(e) => setFilterState((prev) => ({ ...prev, value: e.target.value }))} placeholder="Filter value" className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="h-[200px] text-center text-foreground">
                      No rows found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="py-4 px-4 text-foreground whitespace-nowrap">
                          {row[col.key] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {showManageColumns && (
            <div ref={manageColumnsRef} className="absolute left-2 top-[80px] w-[335px] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-border relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={manageSearch} onChange={(e) => setManageSearch(e.target.value)} type="text" placeholder="Search" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background" />
              </div>
              <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {searchedColumns.map((col) => (
                  <button key={col.key} type="button" onClick={() => toggleColumn(col.key)} className="w-full flex items-center gap-3 text-left">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${col.visible ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-transparent"}`}>
                      {col.visible && <Check className="w-4 h-4" />}
                    </span>
                    <span className="text-foreground">{col.label}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-4 flex items-center justify-between">
                <button type="button" onClick={toggleAllColumns} className="flex items-center gap-3 text-foreground">
                  <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary"><Check className="w-4 h-4" /></span>
                  <span>Show/Hide All</span>
                </button>
                <button type="button" onClick={resetColumns} className="text-muted-foreground hover:text-foreground transition">Reset</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}