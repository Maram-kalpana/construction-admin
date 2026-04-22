import { useState } from "react";
import { Eye, EyeOff, UserPlus, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED 🔥", form);

    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("All fields required ❗");
      return;
    }

    const success = await register(form);

    if (!success) {
      alert("Registration Failed ❌");
      return;
    }

    alert("Registered Successfully ✅");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl flex overflow-hidden min-h-[600px] border">

        {/* LEFT */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-center">
          <div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Building2 className="text-white" />
            </div>
            <h1 className="text-white text-3xl mt-6 font-bold">
              Create Admin Account
            </h1>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 p-10">
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full h-12 border rounded px-4"
            />

            <input
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full h-12 border rounded px-4"
            />

            <input
              placeholder="Phone"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full h-12 border rounded px-4"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full h-12 border rounded px-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded"
            >
              Register
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}