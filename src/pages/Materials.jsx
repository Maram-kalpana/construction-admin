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

          </div>
        </div>

        {/* ✅ TABLE */}
        <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full border-separate border-spacing-0 text-sm min-w-[1000px]">
              <thead>
                <tr className="bg-secondary/30">
                  <th rowSpan="2" className="px-4 py-4 border">S.No</th>
                  <th rowSpan="2" className="px-4 py-4 border">Date</th>
                  <th rowSpan="2" className="px-4 py-4 border">Supplier</th>

                  {/* ✅ Units added */}
                  <th rowSpan="2" className="px-4 py-4 border">Gravel (m³)</th>
                  <th rowSpan="2" className="px-4 py-4 border">Sand (m³)</th>

                  <th colSpan="3" className="px-4 py-4 border">AGGREGATE</th>
                  <th colSpan="2" className="px-4 py-4 border">BRICKS</th>

                  <th rowSpan="2" className="px-4 py-4 border">RR Stone (m³)</th>
                  
                </tr>

                <tr className="bg-secondary/15">
                  <th className="px-4 py-3 border">10 mm</th>
                  <th className="px-4 py-3 border">20 mm</th>
                  <th className="px-4 py-3 border">40 mm</th>
                  <th className="px-4 py-3 border">Fly Ash</th>
                  <th className="px-4 py-3 border">Red Brick</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-10">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.sno} className="hover:bg-secondary/10">
                      <td className="border px-4 py-3">{row.sno}</td>
                      <td className="border px-4 py-3">{row.date}</td>
                      <td className="border px-4 py-3">{row.supplier}</td>
                      <td className="border px-4 py-3">{row.gravel}</td>
                      <td className="border px-4 py-3">{row.sand}</td>
                      <td className="border px-4 py-3">{row.mm10}</td>
                      <td className="border px-4 py-3">{row.mm20}</td>
                      <td className="border px-4 py-3">{row.mm40}</td>
                      <td className="border px-4 py-3">{row.flyAsh}</td>
                      <td className="border px-4 py-3">{row.redBrick}</td>
                      <td className="border px-4 py-3">{row.rrStone}</td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}