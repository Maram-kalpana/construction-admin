import React from "react";
import AdminLayout from "../components/AdminLayout";

export default function Materials() {
  const rows = [
    {
      sno: 1,
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
    {
      sno: 4,
      date: "2025-04-13",
      supplier: "City Build Mart",
      gravel: 160,
      sand: 110,
      mm10: 55,
      mm20: 70,
      mm40: 40,
      flyAsh: 700,
      redBrick: 1800,
      rrStone: 35,
      others: "Paver blocks",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Rows are stored with project and date for traceability (same schema as daily site materials).
        </p>

        <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .materials-scroll-hidden::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <table className="materials-scroll-hidden w-full border-separate border-spacing-0 text-sm min-w-[980px]">
              <thead>
                <tr className="bg-secondary/30">
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    S.No
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    Date
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    Supplier
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    Gravel
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    Sand
                  </th>
                  <th
                    colSpan="3"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    AGGREGATE
                  </th>
                  <th
                    colSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    BRICKS
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-r border-border"
                  >
                    RR Stone
                  </th>
                  <th
                    rowSpan="2"
                    className="px-4 py-5 text-center font-semibold text-foreground border-b border-border"
                  >
                    Others
                  </th>
                </tr>

                <tr className="bg-secondary/15">
                  <th className="px-4 py-4 text-center font-medium text-muted-foreground border-b border-r border-border">
                    10 mm
                  </th>
                  <th className="px-4 py-4 text-center font-medium text-muted-foreground border-b border-r border-border">
                    20 mm
                  </th>
                  <th className="px-4 py-4 text-center font-medium text-muted-foreground border-b border-r border-border">
                    40 mm
                  </th>
                  <th className="px-4 py-4 text-center font-medium text-muted-foreground border-b border-r border-border">
                    Fly Ash
                  </th>
                  <th className="px-4 py-4 text-center font-medium text-muted-foreground border-b border-r border-border">
                    Red Brick
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="12"
                      className="h-[260px] text-center align-middle text-foreground"
                    >
                      No rows
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={row.sno}
                      className={`transition hover:bg-secondary/10 ${
                        index !== rows.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.sno}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border whitespace-nowrap">
                        {row.supplier}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.gravel}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.sand}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.mm10}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.mm20}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.mm40}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.flyAsh}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.redBrick}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-r border-border">
                        {row.rrStone}
                      </td>
                      <td className="px-4 py-4 text-center text-foreground border-b border-border whitespace-nowrap">
                        {row.others}
                      </td>
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