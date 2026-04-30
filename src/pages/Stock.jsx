import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown, ArrowUp, ArrowDown, MoreVertical, Filter,
  EyeOff, Columns3, X, Search, Check,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const defaultColumns = [
    { key: "date", label: "Date", visible: true },
  { key: "vendor", label: "Vendor", visible: true },
  { key: "work", label: "Work", visible: true },
  { key: "quantity", label: "Quantity", visible: true },
  { key: "reasonEdit", label: "Reason(Edit)", visible: true },
  { key: "reasonDelete", label: "Reason(Delete)", visible: true },
];

const stockRows = [
  { id: 1, date: "2025-04-10", vendor: "ABC Suppliers", work: "Foundation", quantity: "50 bags", reasonEdit: "-", reasonDelete: "-" },
  { id: 2, date: "2025-04-10", vendor: "XYZ Traders", work: "Welding", quantity: "20 rods", reasonEdit: "-", reasonDelete: "-" },
  { id: 3, date: "2025-04-11", vendor: "BuildMart", work: "Masonry", quantity: "1000 pcs", reasonEdit: "-", reasonDelete: "-" },
  { id: 4, date: "2025-04-12", vendor: "River Supplies", work: "Plastering", quantity: "5 trucks", reasonEdit: "-", reasonDelete: "-" },
  { id: 5, date: "2025-04-12", vendor: "Stone Depot", work: "Leveling", quantity: "3 trucks", reasonEdit: "-", reasonDelete: "-" },
];

export default function Stock() {
  const [date, setDate] = useState("");
  const [columns, _setColumns] = useState(defaultColumns);
  const [rows, _setRows] = useState(() => {
  const saved = localStorage.getItem("stockData");
  const parsed = saved ? JSON.parse(saved) : null;
  return parsed && parsed.length > 0 ? parsed : stockRows;
});

  const [_headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [_selectedColumnKey, _setSelectedColumnKey] = useState("date");
  const [_showFilterRow, _setShowFilterRow] = useState(false);
  const [_showManageColumns, setShowManageColumns] = useState(false);
  const [_manageSearch, _setManageSearch] = useState("");
  const [project, setProject] = useState("");
  const projects = ["Project Alpha", "Project Beta", "Project Gamma"];

  const [_sortConfig, _setSortConfig] = useState({ key: "", direction: "" });
  const [_filterState, _setFilterState] = useState({ column: "date", operator: "contains", value: "" });

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("stockData", JSON.stringify(rows));
    window.dispatchEvent(new Event("dashboard-data-updated"));
  }, [rows]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) setHeaderMenuOpen(false);
      if (manageColumnsRef.current && !manageColumnsRef.current.contains(event.target)) setShowManageColumns(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRows = useMemo(() => {
    let data = rows.filter((row) => (date ? row.date === date : true));
    return data;
  }, [rows, date]);

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">Stock rows are shared with daily site reports (project + date).</p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none text-foreground">
                <option value="">Select Project</option>
                {projects.map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="button" onClick={() => { setDate(""); setProject(""); }} className="text-sm font-semibold text-foreground hover:text-primary transition self-start sm:self-center">Clear</button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-secondary/50">
                {visibleColumns.map((col) => (
                  <th key={col.key} className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border last:border-r-0">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td colSpan={visibleColumns.length} className="py-10 text-center text-muted-foreground">No rows found</td></tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition">
                    {visibleColumns.map((col) => (
                      <td key={col.key} className="py-3 px-4 border-b border-border border-r border-border last:border-r-0 text-center whitespace-nowrap">{row[col.key] ?? "-"}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}