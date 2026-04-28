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
    <div className="mb-2">
      {/* Group Header */}
      {!collapsed ? (
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
            hasActiveChild
              ? "text-white bg-white/10"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <group.icon className="w-4 h-4" />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        <div className="flex justify-center py-3">
          <div
            className={`w-6 h-0.5 rounded-full ${
              hasActiveChild ? "bg-blue-500" : "bg-slate-700"
            }`}
          />
        </div>
      )}

      {/* Items */}
      {(isOpen || collapsed) && (
        <div
          className={`space-y-1 ${
            !collapsed ? "mt-2 ml-3 pl-3 border-l border-slate-700/60" : ""
          }`}
        >
          {group.items.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.label}</span>}

                {/* Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
        { label: "Stock", icon: Boxes, path: "/dashboard/stock" },
        { label: "Materials", icon: BrickWall, path: "/dashboard/materials" },
        { label: "Machinery", icon: Wrench, path: "/dashboard/machinery" },
        { label: "Reports", icon: FileBarChart2, path: "/dashboard/reports" },
      ],
    },
    {
      label: "Admin Account",
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
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-[#252b36] border-r border-[#343c46]
          transform transition-transform duration-300
          ${collapsed ? "w-[80px]" : "w-[240px]"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[#343c46] gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-lg">SR</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navGroups.map((group) => (
            <SidebarGroup
              key={group.label}
              group={group}
              collapsed={collapsed}
              isOpen={openGroups[group.label]}
              onToggle={() => toggleGroup(group.label)}
            />
          ))}
        </nav>

        {/* User */}
        {!collapsed && (
          <div className="mx-3 mb-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">John Doe</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse button (desktop only) */}
        <div className="hidden lg:flex justify-center py-2 border-t border-[#343c46]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-800"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}