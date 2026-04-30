import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ChevronDown } from "lucide-react";

export default function Materials() {
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");

  const projects = ["sr", "Project Alpha", "Project Beta"];

  const rows = [
    {
      sno: 1,
      project: "sr",
      date: "2025-04-10",
      supplier: "Sharma Suppliers",
      gravel: 120,
      sand: 80,
      mm10: 40,
      mm20: 55,
      mm40: 30,
      flyAsh: 500,
      redBrick: 1200,
      rrStone: 25,
      others: "Cement bags",
    },
    {
      sno: 2,
      project: "sr",
      date: "2025-04-11",
      supplier: "Patel Traders",
      gravel: 140,
      sand: 90,
      mm10: 50,
      mm20: 60,
      mm40: 35,
      flyAsh: 650,
      redBrick: 1500,
      rrStone: 30,
      others: "Binding wire",
    },
    {
      sno: 3,
      project: "sr",
      date: "2025-04-12",
      supplier: "RK Materials",
      gravel: 100,
      sand: 75,
      mm10: 45,
      mm20: 50,
      mm40: 28,
      flyAsh: 450,
      redBrick: 1000,
      rrStone: 20,
      others: "Waterproofing powder",
    },
  ];

  // 🔍 Filter logic
  const filteredRows = rows.filter((row) => {
    const projectMatch = project ? row.project === project : true;
    const dateMatch = date ? row.date === date : true;
    return projectMatch && dateMatch;
  });

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">

        {/* ✅ FILTER SECTION */}
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
                <option value="">All</option>
                {projects.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Date Filter */}
           {/* Date Filter */}
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

        {/* ✅ TABLE */}
        
          <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">S.No</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Date</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Vendor</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Item Name</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-right border-b border-border border-r border-border">Quantity</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border">Reason(Edit)</th>
<th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border">Reason(Delete)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                   <td colSpan="7" className="text-center py-10 text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                ) : (
                   filteredRows.map((row) => (
                    <tr key={row.sno} className="hover:bg-secondary/30 transition">
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.sno}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.supplier}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.others}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border text-right">{row.gravel}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border text-center">-</td>
<td className="py-3 px-4 border-b border-border text-center">-</td>
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