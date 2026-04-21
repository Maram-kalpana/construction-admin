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
  { key: "date", label: "Date", visible: true },
  { key: "item", label: "Item", visible: true },
  { key: "opening", label: "Opening", visible: true },
  { key: "in", label: "In", visible: true },
  { key: "out", label: "Out", visible: true },
  { key: "closing", label: "Closing", visible: true },
];

const stockRows = [
  {
    id: 1,
    date: "2025-04-10",
    item: "Cement",
    opening: 120,
    in: 50,
    out: 30,
    closing: 140,
  },
  {
    id: 2,
    date: "2025-04-10",
    item: "Steel",
    opening: 80,
    in: 20,
    out: 15,
    closing: 85,
  },
  {
    id: 3,
    date: "2025-04-11",
    item: "Bricks",
    opening: 500,
    in: 200,
    out: 150,
    closing: 550,
  },
  {
    id: 4,
    date: "2025-04-12",
    item: "Sand",
    opening: 300,
    in: 100,
    out: 80,
    closing: 320,
  },
  {
    id: 5,
    date: "2025-04-12",
    item: "Gravel",
    opening: 220,
    in: 60,
    out: 40,
    closing: 240,
  },
];

export default function Stock() {
  const [date, setDate] = useState("");
  const [columns, setColumns] = useState(defaultColumns);
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("stockData");
    return saved ? JSON.parse(saved) : stockRows;
  });

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({
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

  useEffect(() => {
    localStorage.setItem("stockData", JSON.stringify(rows));
    window.dispatchEvent(new Event("dashboard-data-updated"));
  }, [rows]);

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
      const dateMatch = date ? row.date === date : true;
      return dateMatch;
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
  }, [rows, date, showFilterRow, filterState, sortConfig]);

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

  const openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Stock rows are shared with daily site reports (project + date).
        </p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="button"
              onClick={() => setDate("")}
              className="text-sm font-semibold text-foreground hover:text-primary transition self-start sm:self-center"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-card shadow-sm overflow-visible relative min-h-[420px]">
          <div className="overflow-x-auto rounded-[28px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  {visibleColumns.map((col) => {
                    const isSorted = sortConfig.key === col.key;
                    const isAsc = isSorted && sortConfig.direction === "asc";
                    const isDesc = isSorted && sortConfig.direction === "desc";

                    return (
                      <th
                        key={col.key}
                        className="text-left py-4 px-4 font-medium text-foreground relative whitespace-nowrap"
                      >
                        <div
                          className="flex items-center gap-2"
                          ref={selectedColumnKey === col.key ? headerMenuRef : null}
                        >
                          <span className="whitespace-nowrap">{col.label}</span>

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

                          {headerMenuOpen && selectedColumnKey === col.key && (
                            <div className="absolute top-full left-0 mt-2 w-[275px] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                              <button
                                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                                onClick={() => {
                                  setSortConfig({ key: col.key, direction: "asc" });
                                  setHeaderMenuOpen(false);
                                }}
                              >
                                <ArrowUp className="w-4 h-4 text-muted-foreground" />
                                <span>Sort by ASC</span>
                              </button>

                              <button
                                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                                onClick={() => {
                                  setSortConfig({ key: col.key, direction: "desc" });
                                  setHeaderMenuOpen(false);
                                }}
                              >
                                <ArrowDown className="w-4 h-4 text-muted-foreground" />
                                <span>Sort by DESC</span>
                              </button>

                              <button
                                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition"
                                onClick={() => {
                                  setSortConfig({ key: "", direction: "" });
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
                                  setFilterState((prev) => ({ ...prev, column: col.key }));
                                  setShowFilterRow(true);
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
                {showFilterRow && (
                  <tr className="border-b border-border">
                    <td colSpan={visibleColumns.length} className="p-4">
                      <div className="max-w-[660px] rounded-2xl bg-card shadow-xl border border-border p-5 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowFilterRow(false)}
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
                            onChange={(e) =>
                              setFilterState((prev) => ({
                                ...prev,
                                column: e.target.value,
                              }))
                            }
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
                            onChange={(e) =>
                              setFilterState((prev) => ({
                                ...prev,
                                operator: e.target.value,
                              }))
                            }
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
                            onChange={(e) =>
                              setFilterState((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            placeholder="Filter value"
                            className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length}
                      className="h-[320px] text-center align-middle text-foreground"
                    >
                      No rows
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      {visibleColumns.map((col) => (
                        <td
                          key={col.key}
                          className="py-4 px-4 text-foreground whitespace-nowrap"
                        >
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
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

              <div className="p-4 space-y-4 max-h-[320px] overflow-y-auto sidebar-scroll-hidden">
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