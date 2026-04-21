import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Users from "../pages/Users";
import Accounts from "../pages/Accounts";
import Expenses from "../pages/Expenses";
import Labour from "../pages/Labour";
import Vendor from "../pages/Vendor";
import Stock from "../pages/Stock";
import Materials from "../pages/Materials";
import Machinery from "../pages/Machinery";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Reports from "../pages/Reports";
import DailyReport from "../pages/DailyReport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "users", element: <Users /> },
      { path: "accounts", element: <Accounts /> },
      { path: "expenses", element: <Expenses /> },
      { path: "labour", element: <Labour /> },
      { path: "vendors", element: <Vendor /> },
      { path: "stock", element: <Stock /> },
      { path: "materials", element: <Materials /> },
      { path: "machinery", element: <Machinery /> },
      { path: "reports", element: <Reports /> },
      { path: "daily-report", element: <DailyReport /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);