import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex-shrink-0">
        <Sidebar
          collapsed={!sidebarOpen}
          setCollapsed={(value) => setSidebarOpen(!value)}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col bg-transparent">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-background"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}