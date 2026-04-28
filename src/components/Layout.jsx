import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* ✅ Sidebar with fixed width */}
      <div
        className="hidden lg:block transition-all duration-300"
        style={{
          width: sidebarOpen ? "260px" : "80px",
        }}
      >
        <Sidebar
          collapsed={!sidebarOpen}
          setCollapsed={(value) => setSidebarOpen(!value)}
        />
      </div>

      {/* ✅ Mobile Sidebar (overlay) */}
      <div className="lg:hidden">
        <Sidebar
          collapsed={false}
          mobile
          setCollapsed={() => setSidebarOpen(false)}
        />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto bg-background p-4 md:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}