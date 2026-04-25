import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Shield,
  HardHat,
  Boxes,
  BrickWall,
  Wrench,
  Truck,
  FileBarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  Layers,
  Briefcase,
  Cog,
  UserCircle,
} from "lucide-react";

function SidebarGroup({ group, collapsed, isOpen, onToggle }) {
  const location = useLocation();

  const hasActiveChild = group.items.some((item) =>
    location.pathname.startsWith(item.path)
  );

  return (
    <div className="mb-1">
      {!collapsed ? (
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            hasActiveChild
              ? "text-white bg-white/10"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <group.icon className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        <div className="flex justify-center py-2">
          <div
            className={`w-6 h-0.5 rounded-full ${
              hasActiveChild ? "bg-blue-500" : "bg-slate-700"
            }`}
          />
        </div>
      )}

      {(isOpen || collapsed) && (
        <div className="overflow-hidden">
          <div
            className={`space-y-0.5 ${
              !collapsed ? "mt-1 ml-3 pl-3 border-l border-slate-700/60" : "mt-1"
            }`}
          >
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}

                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const navGroups = [
    {
      label: "Overview",
      icon: Layers,
      items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
    },
    {
      label: "Management",
      icon: Briefcase,
      items: [
        { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
        { label: "Users", icon: Users, path: "/dashboard/users" },
        { label: "Vendors", icon: Truck, path: "/dashboard/vendors" },
        { label: "Accounts", icon: Shield, path: "/dashboard/accounts" },
      ],
    },
    {
      label: "Operations",
      icon: Cog,
      items: [
        { label: "Labour", icon: HardHat, path: "/dashboard/labour" },
        // { label: "Vendors", icon: Truck, path: "/dashboard/vendors" },
        { label: "Stock", icon: Boxes, path: "/dashboard/stock" },
        { label: "Materials", icon: BrickWall, path: "/dashboard/materials" },
        { label: "Machinery", icon: Wrench, path: "/dashboard/machinery" },
        { label: "Reports", icon: FileBarChart2, path: "/dashboard/reports" },
        { label: "Daily Report", icon: Calendar, path: "/dashboard/daily-report" },
      ],
    },
    {
      label: " Admin Account",
      icon: UserCircle,
      items: [
        { label: "Profile", icon: UserCircle, path: "/dashboard/profile" },
        { label: "Settings", icon: Cog, path: "/dashboard/settings" },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    navGroups.forEach((group) => {
      initial[group.label] = group.items.some((item) =>
        location.pathname.startsWith(item.path)
      );
    });
    return initial;
  });

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-[#252b36] border-r border-[#343c46] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[276px]"
      }`}
    >
      <div className="h-16 flex items-center px-5 border-b border-[#343c46] gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">
          <Zap className="w-4 h-4 text-white" />
        </div>

        {!collapsed && (
          <span className="font-heading font-bold text-[18px] text-white tracking-tight">
            SR
          </span>
        )}
      </div>

      {/* Yaha par humne scrollbar ko hide karne ke liye Tailwind Arbitrary classes use ki hain */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navGroups.map((group) => (
          <SidebarGroup
            key={group.label}
            group={group}
            collapsed={collapsed}
            isOpen={openGroups[group.label] ?? false}
            onToggle={() => toggleGroup(group.label)}
          />
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-2 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate capitalize">Admin</p>
            </div>
            <UserCircle className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}

      <div className="py-1.5 border-t border-[#343c46] flex justify-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}