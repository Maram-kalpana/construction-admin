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

const tabs = ["Labour", "Machinery", "Materials", "Stock", "Details", "Vendors"];

const vendorsRows = [
  { id: 1, name: "ABC Labour Contractors", type: "labour", contact: "9000000001", notes: "" },
  { id: 2, name: "XYZ Equipment", type: "machinery", contact: "9000000002", notes: "" },
  { id: 3, name: "BuildMart Supplies", type: "material", contact: "9000000003", notes: "" },
  { id: 4, name: "Prime Stock Agency", type: "stock", contact: "9000000004", notes: "" },
  { id: 5, name: "Stone Depot", type: "material", contact: "9000000005", notes: "" },
];

const defaultColumnsMap = {
  Labour: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "party", label: "Party", visible: true },
    { key: "m", label: "M", visible: true },
    { key: "f", label: "F", visible: true },
    { key: "work", label: "Work", visible: true },
    { key: "meas", label: "Meas.", visible: true },
    { key: "actions", label: "Actions", visible: true },
  ],
  Machinery: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "party", label: "Party", visible: true },
    { key: "start", label: "Start", visible: true },
    { key: "close", label: "Close", visible: true },
    { key: "hrs", label: "Hrs", visible: true },
    { key: "submitted", label: "Submitted", visible: true },
    { key: "work", label: "Work", visible: true },
    { key: "meas", label: "Meas.", visible: true },
    { key: "actions", label: "Actions", visible: true },
  ],
  Materials: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "supplier", label: "Supplier", visible: true },
    { key: "gravel", label: "Gravel", visible: true },
    { key: "sand", label: "Sand", visible: true },
    { key: "tenmm", label: "10mm", visible: true },
    { key: "twentymm", label: "20mm", visible: true },
    { key: "fortymm", label: "40mm", visible: true },
    { key: "flyash", label: "Fly ash", visible: true },
    { key: "redbrk", label: "Red brk", visible: true },
    { key: "rr", label: "RR", visible: true },
    { key: "other", label: "Other", visible: true },
    { key: "actions", label: "Actions", visible: true },
  ],
  Stock: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "item", label: "Item", visible: true },
    { key: "open", label: "Open", visible: true },
    { key: "in", label: "In", visible: true },
    { key: "out", label: "Out", visible: true },
    { key: "close", label: "Close", visible: true },
    { key: "actions", label: "Actions", visible: true },
  ],
  Details: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "actions", label: "Actions", visible: true },
  ],
  Vendors: [
    { key: "name", label: "Name", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "contact", label: "Contact", visible: true },
    { key: "notes", label: "Notes", visible: true },
  ],
};

const initialRowsMap = {
  Labour: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", party: "Labour Team A", m: 12, f: 4, work: "Brick masonry", meas: "120 sq ft", actions: "-" },
    { id: 2, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", party: "Labour Team B", m: 8, f: 3, work: "Plastering", meas: "85 sq ft", actions: "-" },
    { id: 3, project: "Project Alpha", date: "2025-04-12", manager: "Rohit Sharma", party: "Labour Team C", m: 10, f: 2, work: "Shuttering", meas: "60 sq ft", actions: "-" },
    { id: 4, project: "Project Gamma", date: "2025-04-13", manager: "Amit Kumar", party: "Labour Team D", m: 14, f: 5, work: "Tile laying", meas: "140 sq ft", actions: "-" },
    { id: 5, project: "Project Alpha", date: "2025-04-14", manager: "Rohit Sharma", party: "Labour Team E", m: 9, f: 4, work: "Painting", meas: "200 sq ft", actions: "-" },
  ],
  Machinery: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", party: "Excavator", start: "08:00", close: "12:30", hrs: "4.5", submitted: "Yes", work: "Foundation excavation", meas: "250 sq ft", actions: "-" },
    { id: 2, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", party: "JCB", start: "09:00", close: "01:00", hrs: "4", submitted: "Yes", work: "Site leveling", meas: "300 sq ft", actions: "-" },
    { id: 3, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", party: "Crane", start: "07:00", close: "11:00", hrs: "4", submitted: "No", work: "Steel beam lifting", meas: "10 lifts", actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", party: "Concrete Mixer", start: "10:00", close: "03:00", hrs: "5", submitted: "Yes", work: "Concrete mixing", meas: "20 batches", actions: "-" },
    { id: 5, project: "Project Gamma", date: "2025-04-14", manager: "Amit Kumar", party: "Vibrator", start: "08:30", close: "11:30", hrs: "3", submitted: "Yes", work: "Column compaction", meas: "18 columns", actions: "-" },
  ],
  Materials: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", supplier: "BuildMart Supplies", gravel: 120, sand: 80, tenmm: 40, twentymm: 55, fortymm: 30, flyash: 500, redbrk: 1200, rr: 25, other: "Cement bags", actions: "-" },
    { id: 2, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", supplier: "Patel Traders", gravel: 140, sand: 90, tenmm: 50, twentymm: 60, fortymm: 35, flyash: 650, redbrk: 1500, rr: 30, other: "Binding wire", actions: "-" },
    { id: 3, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", supplier: "Stone Depot", gravel: 100, sand: 70, tenmm: 35, twentymm: 48, fortymm: 22, flyash: 400, redbrk: 1000, rr: 20, other: "Paver blocks", actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", supplier: "City Build Mart", gravel: 160, sand: 110, tenmm: 55, twentymm: 70, fortymm: 40, flyash: 700, redbrk: 1800, rr: 35, other: "Sealant", actions: "-" },
    { id: 5, project: "Project Beta", date: "2025-04-14", manager: "Priya Verma", supplier: "RK Materials", gravel: 115, sand: 85, tenmm: 42, twentymm: 52, fortymm: 27, flyash: 480, redbrk: 1250, rr: 24, other: "Admixture", actions: "-" },
  ],
  Stock: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", item: "Cement", open: 120, in: 50, out: 30, close: 140, actions: "-" },
    { id: 2, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", item: "Steel", open: 80, in: 20, out: 15, close: 85, actions: "-" },
    { id: 3, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", item: "Bricks", open: 500, in: 200, out: 150, close: 550, actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", item: "Sand", open: 300, in: 100, out: 80, close: 320, actions: "-" },
    { id: 5, project: "Project Gamma", date: "2025-04-14", manager: "Amit Kumar", item: "Gravel", open: 220, in: 60, out: 40, close: 240, actions: "-" },
  ],
  Details: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", description: "Daily site progress reviewed and approved.", actions: "-" },
    { id: 2, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", description: "Material delay reported by supplier.", actions: "-" },
    { id: 3, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", description: "Machinery breakdown resolved by noon.", actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", description: "Concrete pour completed for slab section B.", actions: "-" },
    { id: 5, project: "Project Beta", date: "2025-04-14", manager: "Priya Verma", description: "Additional labour requested for finishing work.", actions: "-" },
  ],
  Vendors: vendorsRows,
};

const cloneColumns = (tab) => defaultColumnsMap[tab].map((col) => ({ ...col }));

const createColumnsState = () => ({
  Labour: cloneColumns("Labour"),
  Machinery: cloneColumns("Machinery"),
  Materials: cloneColumns("Materials"),
  Stock: cloneColumns("Stock"),
  Details: cloneColumns("Details"),
  Vendors: cloneColumns("Vendors"),
});

const createSortState = () => ({
  Labour: { key: "", direction: "" },
  Machinery: { key: "", direction: "" },
  Materials: { key: "", direction: "" },
  Stock: { key: "", direction: "" },
  Details: { key: "", direction: "" },
  Vendors: { key: "", direction: "" },
});

const createFilterState = () => ({
  Labour: { column: "date", operator: "contains", value: "" },
  Machinery: { column: "date", operator: "contains", value: "" },
  Materials: { column: "date", operator: "contains", value: "" },
  Stock: { column: "date", operator: "contains", value: "" },
  Details: { column: "date", operator: "contains", value: "" },
  Vendors: { column: "name", operator: "contains", value: "" },
});

const createShowFilterRows = () => ({
  Labour: false,
  Machinery: false,
  Materials: false,
  Stock: false,
  Details: false,
  Vendors: false,
});

const createManageSearchState = () => ({
  Labour: "",
  Machinery: "",
  Materials: "",
  Stock: "",
  Details: "",
  Vendors: "",
});

// 👇 NAYA FUNCTION: LocalStorage se projects laane ke liye
const getStoredProjects = () => {
  const saved = localStorage.getItem("projectsData");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function Reports() {
  // 👇 Projects ki dynamic list state mein daali
  const [projectList, setProjectList] = useState(getStoredProjects);
  
  // 👇 Default selected project
  const [project, setProject] = useState(() => {
    const projects = getStoredProjects();
    return projects.length > 0 ? projects[0].name : "";
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState("Labour");

  const [columnsByTab, setColumnsByTab] = useState(createColumnsState);
  const [sortByTab, setSortByTab] = useState(createSortState);
  const [filterByTab, setFilterByTab] = useState(createFilterState);
  const [showFilterRowByTab, setShowFilterRowByTab] = useState(createShowFilterRows);
  const [manageSearchByTab, setManageSearchByTab] = useState(createManageSearchState);

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [showManageColumns, setShowManageColumns] = useState(false);

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);

  const isVendorsTab = activeTab === "Vendors";

  // 👇 Component load hote hi latest projects fetch karega
  useEffect(() => {
    const latestProjects = getStoredProjects();
    setProjectList(latestProjects);
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

  const rows = initialRowsMap[activeTab];
  const columns = columnsByTab[activeTab];
  const visibleColumns = columns.filter((col) => col.visible);
  const sortConfig = sortByTab[activeTab];
  const filterState = filterByTab[activeTab];
  const showFilterRow = showFilterRowByTab[activeTab];
  const manageSearch = manageSearchByTab[activeTab];

  const searchedColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (!isVendorsTab) {
      data = data.filter((row) => {
        // 👇 Agar 'project' khali hai ("All Projects"), toh true return karega
        const projectMatch = project ? row.project === project : true;
        const fromMatch = fromDate ? row.date >= fromDate : true;
        const toMatch = toDate ? row.date <= toDate : true;
        return projectMatch && fromMatch && toMatch;
      });
    }

    if (!isVendorsTab && showFilterRow && filterState.value.trim()) {
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

    if (!isVendorsTab && sortConfig.key && sortConfig.direction) {
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
  }, [rows, isVendorsTab, project, fromDate, toDate, showFilterRow, filterState, sortConfig]);

  const toggleColumn = (key) => {
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      ),
    }));
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((col) => ({
        ...col,
        visible: !allVisible,
      })),
    }));
  };

  const resetColumns = () => {
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: cloneColumns(activeTab),
    }));
    setManageSearchByTab((prev) => ({
      ...prev,
      [activeTab]: "",
    }));
  };

  const openColumnMenu = (key) => {
    if (isVendorsTab) return;

    setSelectedColumnKey(key);
    setFilterByTab((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        column: key,
      },
    }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  const updateFilterState = (field, value) => {
    setFilterByTab((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const renderTable = () => {
    return (
      <div className={`overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${headerMenuOpen ? 'min-h-[350px]' : ''}`}>
        <table className="w-max min-w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              {visibleColumns.map((col) => {
                const isSorted = sortConfig.key === col.key;
                const isAsc = isSorted && sortConfig.direction === "asc";
                const isDesc = isSorted && sortConfig.direction === "desc";

                return (
                  <th
                    key={col.key}
                    className="text-left py-4 px-4 font-semibold text-foreground relative whitespace-nowrap"
                  >
                    <div
                      className="flex items-center gap-2"
                      ref={!isVendorsTab && selectedColumnKey === col.key ? headerMenuRef : null}
                    >
                      <span className="whitespace-nowrap">{col.label}</span>

                      {!isVendorsTab && (
                        <>
                          {isAsc && <ArrowUp className="w-4 h-4 text-primary" />}
                          {isDesc && <ArrowDown className="w-4 h-4 text-primary" />}

                          {!isSorted && (
                            <span className="flex items-center gap-0.5">
                              <ArrowUp className="w-3.5 h-3.5 text-muted-foreground/70" />
                              <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/70 -ml-1" />
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => openColumnMenu(col.key)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </>
                      )}

                      {!isVendorsTab && headerMenuOpen && selectedColumnKey === col.key && (
                        <div className="absolute top-full left-0 mt-2 w-[275px] rounded-2xl border border-border bg-card shadow-xl z-30 overflow-hidden">
                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              setSortByTab((prev) => ({
                                ...prev,
                                [activeTab]: { key: col.key, direction: "asc" },
                              }));
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <ArrowUp className="w-4 h-4 text-muted-foreground" />
                            <span>Sort by ASC</span>
                          </button>

                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              setSortByTab((prev) => ({
                                ...prev,
                                [activeTab]: { key: col.key, direction: "desc" },
                              }));
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <ArrowDown className="w-4 h-4 text-muted-foreground" />
                            <span>Sort by DESC</span>
                          </button>

                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              setSortByTab((prev) => ({
                                ...prev,
                                [activeTab]: { key: "", direction: "" },
                              }));
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <span className="w-4 h-4" />
                            <span>Unsort</span>
                          </button>

                          <div className="border-t border-border" />

                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              updateFilterState("column", col.key);
                              setShowFilterRowByTab((prev) => ({
                                ...prev,
                                [activeTab]: true,
                              }));
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span>Filter</span>
                          </button>

                          <div className="border-t border-border" />

                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              toggleColumn(col.key);
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                            <span>Hide column</span>
                          </button>

                          <button
                            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                            onClick={() => {
                              setShowManageColumns(true);
                              setHeaderMenuOpen(false);
                            }}
                          >
                            <Columns3 className="w-4 h-4 text-muted-foreground" />
                            <span>Manage columns</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {!isVendorsTab && showFilterRow && (
              <tr className="border-b border-border">
                <td colSpan={visibleColumns.length} className="p-4">
                  <div className="max-w-[660px] rounded-2xl bg-card shadow-xl border border-border p-5 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setShowFilterRowByTab((prev) => ({
                          ...prev,
                          [activeTab]: false,
                        }))
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div className="relative min-w-[170px]">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                        Columns
                      </label>
                      <select
                        value={filterState.column}
                        onChange={(e) => updateFilterState("column", e.target.value)}
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
                      >
                        {columns.map((col) => (
                          <option key={col.key} value={col.key}>
                            {col.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="relative min-w-[170px]">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                        Operator
                      </label>
                      <select
                        value={filterState.operator}
                        onChange={(e) => updateFilterState("operator", e.target.value)}
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
                      >
                        <option value="contains">contains</option>
                        <option value="does not contain">does not contain</option>
                        <option value="equals">equals</option>
                        <option value="does not equal">does not equal</option>
                        <option value="starts with">starts with</option>
                        <option value="ends with">ends with</option>
                        <option value="is empty">is empty</option>
                        <option value="is not empty">is not empty</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="relative flex-1 min-w-[210px]">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                        Value
                      </label>
                      <input
                        type="text"
                        value={filterState.value}
                        onChange={(e) => updateFilterState("value", e.target.value)}
                        placeholder="Filter value"
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition">
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="py-4 px-4 text-foreground whitespace-nowrap">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="h-[220px] text-center align-middle text-foreground">
                  No rows found for this project
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Filter manager submissions by project and date. Edit or delete rows as needed.
        </p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative min-w-[240px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Project
              </label>
              {/* 👇 DYNAMIC DROPDOWN HERE */}
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
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

            <div className="relative min-w-[185px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>

            <div className="relative min-w-[185px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="text-sm font-semibold text-foreground hover:text-primary transition self-start lg:self-center"
            >
              Clear dates
            </button>
          </div>
        </div>

        <div className="bg-card rounded-[28px] border border-border overflow-visible relative">
          <div className="border-b border-border px-4">
            <div className="flex flex-wrap items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setHeaderMenuOpen(false);
                    setShowManageColumns(false);
                  }}
                  className={`py-4 text-sm font-semibold border-b-2 transition ${
                    activeTab === tab
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="border border-border rounded-xl">
              {renderTable()}
            </div>
          </div>

          {!isVendorsTab && showManageColumns && (
            <div
              ref={manageColumnsRef}
              className="absolute left-6 top-[126px] w-[335px] rounded-2xl border border-border bg-card shadow-xl z-30 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={manageSearch}
                    onChange={(e) =>
                      setManageSearchByTab((prev) => ({
                        ...prev,
                        [activeTab]: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Search"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
      </div>
    </AdminLayout>
  );
}