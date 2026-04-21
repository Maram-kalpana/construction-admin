import { useState, useEffect } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion"; // 👈 Framer motion import kiya animation ke liye
import AdminLayout from "../components/AdminLayout";

// 👇 DASHBOARD WALE COLORS KA ARRAY (Jo auto-repeat hoga)
const cardColors = [
  { bgClass: "bg-[#EFF6FF] dark:bg-[#0B1727]", iconClass: "text-[#3B82F6]" }, // Blue
  { bgClass: "bg-[#F5F3FF] dark:bg-[#131128]", iconClass: "text-[#A855F7]" }, // Purple
  { bgClass: "bg-[#F0FDF4] dark:bg-[#0A1A17]", iconClass: "text-[#22C55E]" }, // Green
  { bgClass: "bg-[#FFFBEB] dark:bg-[#1E1410]", iconClass: "text-[#F59E0B]" }, // Amber
];

export default function Vendor() {
  const [search, setSearch] = useState("");

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("vendorsData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadVendors = () => {
      const saved = localStorage.getItem("vendorsData");
      if (saved) {
        setVendors(JSON.parse(saved));
      }
    };

    window.addEventListener("dashboard-data-updated", loadVendors);
    window.addEventListener("focus", loadVendors);

    return () => {
      window.removeEventListener("dashboard-data-updated", loadVendors);
      window.removeEventListener("focus", loadVendors);
    };
  }, []);

  const filtered = vendors.filter(
    (v) =>
      (v.name && v.name.toLowerCase().includes(search.toLowerCase())) ||
      (v.type && v.type.toLowerCase().includes(search.toLowerCase()))
  );

  const getInitials = (name) => {
    if (!name) return "V";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          {vendors.length} vendor accounts
        </p>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search vendors..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vendor, index) => {
            // 👇 Har card ke liye alag color nikalne ka logic
            const colorConfig = cardColors[index % cardColors.length];

            return (
              // 👇 MOTION DIV: Animation ke liye (y=20 se y=0 aayega, delay index ke hisab se)
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} // 👈 ONE-BY-ONE ANIMATION DELAY
                whileHover={{ y: -4, scale: 1.02 }}
                className={`rounded-xl p-5 shadow-sm border border-transparent dark:border-white/5 cursor-pointer ${colorConfig.bgClass}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    
                    {/* 👇 ICON ROUND CIRCLE (Dashboard Design) */}
                    <div className={`w-10 h-10 shrink-0 rounded-full bg-white dark:bg-transparent flex items-center justify-center font-heading font-bold text-sm shadow-sm dark:shadow-none ${colorConfig.iconClass}`}>
                      {getInitials(vendor.name)}
                    </div>
                    
                    <div className="min-w-0 pr-2">
                      <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {vendor.type} Vendor
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">N/A</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{vendor.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{vendor.notes || "Not provided"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 pt-3 border-t border-gray-200 dark:border-white/10">
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Purchase</p>
                    <p className="font-heading font-bold text-gray-900 dark:text-white text-base">₹0</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Orders</p>
                    <p className="font-heading font-bold text-gray-900 dark:text-white text-base">0</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              No vendors found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  ); 
}