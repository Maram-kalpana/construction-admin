import { useState } from "react";
// 👇 FIX 1: CheckCircle2 icon import kiya features list ke liye
import { Eye, EyeOff, LogIn, Building2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = [
      {
        username: "admin",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      },
      {
        username: "manager",
        password: "manager123",
        name: "Manager User",
        role: "manager",
      },
      {
        username: "supervisor",
        password: "supervisor123",
        name: "Supervisor User",
        role: "supervisor",
      },
    ];

    const foundUser = users.find(
      (u) =>
        u.username === form.username.trim() &&
        u.password === form.password.trim()
    );

    if (!foundUser) {
      alert("Invalid username or password");
      return;
    }

    login({
      username: foundUser.username,
      name: foundUser.name,
      role: foundUser.role,
    });

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl flex overflow-hidden min-h-[600px] border border-slate-200 m-auto">
        
        {/* LEFT SIDE: Dark Panel */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>

            <h1 className="mt-8 text-3xl xl:text-4xl font-heading font-bold text-white tracking-tight">
              SR
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-md">
              Manage projects, reports, materials, machinery, labour and stock
              from one premium dashboard experience built for smooth daily operations.
            </p>

            {/* 👇 FIX 2: Khali space ko bharne ke liye naya feature list add kar diya */}
            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-slate-300 text-sm font-medium">Real-time inventory tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-slate-300 text-sm font-medium">Automated daily reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-slate-300 text-sm font-medium">Secure role-based access control</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-6 mt-8 backdrop-blur-sm">
            <p className="text-sm font-bold text-white tracking-wide uppercase">
              Demo Access
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p className="flex justify-between border-b border-white/10 pb-2">
                <span className="font-medium text-white">Admin</span> 
                <span>admin / admin123</span>
              </p>
              <p className="flex justify-between border-b border-white/10 pb-2">
                <span className="font-medium text-white">Manager</span> 
                <span>manager / manager123</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-white">Supervisor</span> 
                <span>supervisor / supervisor123</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Light Panel */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">
            
            <div className="lg:hidden mb-10 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="mt-5 text-2xl font-heading font-bold text-slate-900 tracking-tight">
                Construction ERP
              </h1>
            </div>

            <div className="mb-10 text-left">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Welcome back</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Access your construction workspace and manage daily operations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:hidden">
              <p className="text-sm font-bold text-slate-900 tracking-wide uppercase">Demo Access</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold text-slate-900">Admin</span> <span>admin / admin123</span>
                </p>
                <p className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold text-slate-900">Manager</span> <span>manager / manager123</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-900">Supervisor</span> <span>supervisor / supervisor123</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}