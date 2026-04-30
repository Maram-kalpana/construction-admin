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

const defaultColumns = [
  { key: "sno", label: "S.No", visible: true },
  { key: "date", label: "Date", visible: true },
  { key: "equipment", label: "Equipment", visible: true },
  { key: "vendor", label: "Vendor", visible: true },
  { key: "start", label: "Start", visible: true },
  { key: "close", label: "Close", visible: true },
  { key: "total", label: "Total", visible: true },
  { key: "workDetails", label: "Work Details", visible: true },
  { key: "reasonEdit", label: "Reason(Edit)", visible: true },
  { key: "reasonDelete", label: "Reason(Delete)", visible: true },
];

// 👇 NAYA FUNCTION: LocalStorage se projects laane ke liye
const getStoredProjects = () => {
  const saved = localStorage.getItem("projectsData");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function Machinery() {
  // 👇 Projects ki dynamic list state mein daali
  const [projectList, setProjectList] = useState(getStoredProjects);
  
  // 👇 Default selected project (Agar list mein hai toh pehla select hoga, warna empty)
  const [project, setProject] = useState(() => {
    const projects = getStoredProjects();
    return projects.length > 0 ? projects[0].name : "";
  });

  const [date, setDate] = useState("");
  const [columns, setColumns] = useState(defaultColumns);

  const [_headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, _setShowFilterRow] = useState(false);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [sortConfig, _setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const [filterState, setFilterState] = useState({
    column: "date",
    operator: "contains",
    value: "",
  });

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);

  // Note: Yeh abhi dummy data hai, real app mein yeh API/Database se aayega
  const rows = [
  { id: 1, sno: 1, project: "Project Alpha", date: "2025-04-10", equipment: "Excavator", vendor: "ABC Rentals", start: "08:00", close: "12:30", total: "4.5 hrs", workDetails: "Foundation excavation", reasonEdit: "-", reasonDelete: "-" },
  { id: 2, sno: 2, project: "Project Alpha", date: "2025-04-11", equipment: "Concrete Mixer", vendor: "XYZ Equipment", start: "09:00", close: "05:00", total: "8 hrs", workDetails: "Slab concrete mixing", reasonEdit: "-", reasonDelete: "-" },
  { id: 3, sno: 3, project: "Project Beta", date: "2025-04-10", equipment: "Tower Crane", vendor: "Lift Corp", start: "07:30", close: "01:30", total: "6 hrs", workDetails: "Steel lifting", reasonEdit: "-", reasonDelete: "-" },
  { id: 4, sno: 4, project: "Project Gamma", date: "2025-04-09", equipment: "Vibrator", vendor: "Tool Masters", start: "10:00", close: "03:00", total: "5 hrs", workDetails: "Column compaction", reasonEdit: "-", reasonDelete: "-" },
  { id: 5, sno: 5, project: "Project Alpha", date: "2025-04-12", equipment: "JCB", vendor: "Earth Movers", start: "08:30", close: "11:30", total: "3 hrs", workDetails: "Site leveling", reasonEdit: "-", reasonDelete: "-" },
];

  // Component load hote hi latest projects fetch karega
  useEffect(() => {
    const latestProjects = getStoredProjects();
    setProjectList(latestProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
        setHeaderMenuOpen(false);
      }
      if (manageColumnsRef.current && !manageColumnsRef.current.contains(event.target)) {
        setShowManageColumns(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRows = useMemo(() => {
    let data = rows.filter((row) => {
      // 👇 Agar 'project' khali hai ("All Projects"), toh true return karega
      const projectMatch = project ? row.project === project : true;
      const dateMatch = date ? row.date === date : true;
      return projectMatch && dateMatch;
    });

    if (showFilterRow && filterState.value.trim()) {
      data = data.filter((row) => {
        const rowValue = String(row[filterState.column] ?? "").toLowerCase();
        const filterValue = filterState.value.toLowerCase();

        switch (filterState.operator) {
          case "contains":
            return rowValue.includes(filterValue);
          case "does not contain":
            return !rowValue.includes(filterValue);
          case "equals":
            return rowValue === filterValue;
          case "does not equal":
            return rowValue !== filterValue;
          case "starts with":
            return rowValue.startsWith(filterValue);
          case "ends with":
            return rowValue.endsWith(filterValue);
          case "is empty":
            return rowValue.trim() === "";
          case "is not empty":
            return rowValue.trim() !== "";
          default:
            return true;
        }
      });
    }

    if (sortConfig.key && sortConfig.direction) {
      data = [...data].sort((a, b) => {
        const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
        const bVal = String(b[sortConfig.key] ?? "").toLowerCase();

        if (sortConfig.direction === "asc") {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      });
    }

    return data;
  }, [project, date, showFilterRow, filterState, sortConfig]);

  const visibleColumns = columns.filter((col) => col.visible);

  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumns((prev) =>
      prev.map((col) => ({ ...col, visible: !allVisible }))
    );
  };

  const resetColumns = () => {
    setColumns(defaultColumns);
  };

  const searchedColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const _openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Data comes from manager daily reports.
        </p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
  <div className="flex flex-col md:flex-row gap-4">

    {/* Project Dropdown */}
    <div className="relative min-w-[220px]">
      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
        Project
      </label>
      <select
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
      >
        <option value="">All Projects</option>
        {projectList.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>

    {/* Date Filter */}
   {/* Date Filter + Clear */}
<div className="flex items-center gap-3">
  <div className="relative min-w-[220px]">
    <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
      Date
    </label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-full h-11 rounded-2xl border border-border bg-background px-4"
    />
  </div>
  <button
    type="button"
    onClick={() => setDate("")}
    className="text-sm font-semibold text-foreground hover:text-primary flex-shrink-0"
  >
    Clear
  </button>
</div>

  </div>
</div>

         <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50">
                {visibleColumns.map((col) => (
                  <th key={col.key} className="py-3 px-4 font-semibold text-foreground text-center whitespace-nowrap border-b border-border border-r border-border last:border-r-0">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/30 transition">
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="py-3 px-4 border-b border-border border-r border-border last:border-r-0 text-center whitespace-nowrap">{row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {showManageColumns && (
            <div
              ref={manageColumnsRef}
              className="absolute left-2 top-[95px] w-[335px] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={manageSearch}
                    onChange={(e) => setManageSearch(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto sidebar-scroll-hidden">
                {searchedColumns.map((col) => (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleColumn(col.key)}
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        col.visible
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-transparent"
                      }`}
                    >
                      {col.visible && <Check className="w-4 h-4" />}
                    </span>
                    <span className="text-foreground">{col.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleAllColumns}
                  className="flex items-center gap-3 text-foreground"
                >
                  <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>Show/Hide All</span>
                </button>

                <button
                  type="button"
                  onClick={resetColumns}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      
    </AdminLayout>
  );
}