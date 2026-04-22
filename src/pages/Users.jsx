import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getUsers, createUser } from "../api/projectApi";

const initialUsersData = [
  {
    id: 1,
    name: "Site Manager",
    email: "manager@erp.local",
    phone: "",
    role: "Manager",
    project: "Project Alpha",
    username: "manager",
    password: "********",
    status: "Active",
  },
];

const initialVendorsData = [
  {
    id: 1,
    type: "Labour",
    name: "ABC Labour Contractors",
    contact: "9000000001",
    notes: "",
  },
  {
    id: 2,
    type: "Machinery",
    name: "XYZ Equipment",
    contact: "9000000002",
    notes: "",
  },
  {
    id: 3,
    type: "Material",
    name: "BuildMart Supplies",
    contact: "9000000003",
    notes: "",
  },
];

function SlidePanel({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

export default function Users() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("vendorsData");
    return saved ? JSON.parse(saved) : initialVendorsData;
  });

  const [openAddUserPanel, setOpenAddUserPanel] = useState(false);
  const [openEditUserPanel, setOpenEditUserPanel] = useState(false);
  const [openAddVendorPanel, setOpenAddVendorPanel] = useState(false);
  const [openEditVendorPanel, setOpenEditVendorPanel] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingVendorId, setEditingVendorId] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Manager",
    username: "",
    password: "",
    status: "Active",
  });

  const [vendorForm, setVendorForm] = useState({
    type: "Labour",
    name: "",
    contact: "",
  });

  useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const res = await getUsers();
    console.log("USERS API 👉", res.data);

    setUsers(res.data.data || []);
  } catch (error) {
    console.error("FETCH USERS ERROR ❌", error);
  }
};

  useEffect(() => {
    localStorage.setItem("vendorsData", JSON.stringify(vendors));
    window.dispatchEvent(new Event("dashboard-data-updated"));
  }, [vendors]);

  const filteredUsers = useMemo(() => {
  const q = search.toLowerCase();

  return users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q) ||
      (u.phone?.toString() || "").includes(q)
  );
}, [search, users]);

  const filteredVendors = useMemo(() => {
    const q = search.toLowerCase();
    return vendors.filter(
      (v) =>
        v.type.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.contact.toLowerCase().includes(q)
    );
  }, [search, vendors]);

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "Manager",
      username: "",
      password: "",
      status: "Active",
    });
  };

  const resetVendorForm = () => {
    setVendorForm({
      type: "Labour",
      name: "",
      contact: "",
    });
  };

  const handleAddUser = async () => {
  try {
    if (!userForm.name.trim()) {
      alert("Please enter name");
      return;
    }

    if (!userForm.email.trim()) {
      alert("Please enter email");
      return;
    }

    if (!userForm.role.trim()) {
      alert("Please select role");
      return;
    }

    const payload = {
  name: userForm.name,
  email: userForm.email,
  phone: userForm.phone,
  password: userForm.password,
  role: userForm.role.toLowerCase(),
  status: userForm.status === "Active" ? 1 : 0, // ✅ ADD THIS
};
    await createUser(payload);

    alert("User created ✅");
    setOpenAddUserPanel(false);
    resetUserForm();
    fetchUsers();
  } catch (error) {
    console.error("ADD USER ERROR ❌", error.response?.data);
  }
};

  const handleEditUserClick = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      username: user.username,
      password: user.password,
      status: user.status,
    });
    setOpenEditUserPanel(true);
  };

  const handleUpdateUser = () => {
    if (!userForm.name.trim()) {
      alert("Please enter name");
      return;
    }

    if (!userForm.email.trim()) {
      alert("Please enter email");
      return;
    }

    if (!userForm.role.trim()) {
      alert("Please select role");
      return;
    }

    if (!userForm.username.trim()) {
      alert("Please enter username");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUserId ? { ...user, ...userForm } : user
      )
    );
    setOpenEditUserPanel(false);
    setEditingUserId(null);
    resetUserForm();
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleAddVendor = () => {
    if (!vendorForm.type.trim()) {
      alert("Please select type");
      return;
    }

    if (!vendorForm.name.trim()) {
      alert("Please enter vendor name");
      return;
    }

    if (!vendorForm.contact.trim()) {
      alert("Please enter contact");
      return;
    }

    const newVendor = {
      id: Date.now(),
      ...vendorForm,
    };

    setVendors((prev) => [...prev, newVendor]);
    setOpenAddVendorPanel(false);
    resetVendorForm();
  };

  const handleEditVendorClick = (vendor) => {
    setEditingVendorId(vendor.id);
    setVendorForm({
      type: vendor.type,
      name: vendor.name,
      contact: vendor.contact,
    });
    setOpenEditVendorPanel(true);
  };

  const handleUpdateVendor = () => {
    if (!vendorForm.type.trim()) {
      alert("Please select type");
      return;
    }

    if (!vendorForm.name.trim()) {
      alert("Please enter vendor name");
      return;
    }

    if (!vendorForm.contact.trim()) {
      alert("Please enter contact");
      return;
    }

    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === editingVendorId ? { ...vendor, ...vendorForm } : vendor
      )
    );
    setOpenEditVendorPanel(false);
    setEditingVendorId(null);
    resetVendorForm();
  };

  const handleDeleteVendor = (id) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              Manage supervisors, managers, and vendor accounts from one place.
            </p>

            {activeTab === "users" ? (
              <button
                onClick={() => {
                  resetUserForm();
                  setOpenAddUserPanel(true);
                }}
                className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
              >
                <Plus className="w-4 h-4" />
                Add user
              </button>
            ) : (
              <button
                onClick={() => {
                  resetVendorForm();
                  setOpenAddVendorPanel(true);
                }}
                className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
              >
                <Plus className="w-4 h-4" />
                Add vendor
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card px-4 pt-3">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition ${
                    activeTab === "users"
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent"
                  }`}
                >
                  Managers / Supervisors
                </button>

                <button
                  onClick={() => setActiveTab("vendors")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition ${
                    activeTab === "vendors"
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent"
                  }`}
                >
                  Vendors
                </button>
              </div>
            </div>

            <div className="relative w-full max-w-[430px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder={
                  activeTab === "users" ? "Search users..." : "Search vendors..."
                }
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </div>

          {activeTab === "users" ? (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Username
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition"
                    >
                      <td className="py-3 px-4 text-foreground">{user.name}</td>
                      <td className="py-3 px-4 text-foreground">{user.email}</td>
                      <td className="py-3 px-4 text-foreground">
                        {user.phone || "-"}
                      </td>
                      <td className="py-3 px-4 text-foreground">{user.role}</td>
                      <td className="py-3 px-4 text-foreground">{user.project || "N/A"}</td>
                      <td className="py-3 px-4 text-foreground">{user.username}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status ? "Active" : "Inactive"
                              ? "bg-green-100 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {user.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-4">
                          <button onClick={() => handleEditUserClick(user)}>
                            <Pencil className="w-4 h-4 text-slate-500" />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-10 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Contact
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition"
                    >
                      <td className="py-3 px-4 text-foreground">{vendor.type}</td>
                      <td className="py-3 px-4 text-foreground">{vendor.name}</td>
                      <td className="py-3 px-4 text-foreground">{vendor.contact}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-4">
                          <button onClick={() => handleEditVendorClick(vendor)}>
                            <Pencil className="w-4 h-4 text-slate-500" />
                          </button>
                          <button onClick={() => handleDeleteVendor(vendor.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-muted-foreground">
                        No vendors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>

      {/* --- ADD USER PANEL --- */}
      <SlidePanel open={openAddUserPanel} onClose={() => setOpenAddUserPanel(false)}>
        <div className="p-7 space-y-5">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Add user
          </h2>

          <input
            type="text"
            placeholder="Name"
            value={userForm.name}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <input
            type="text"
            placeholder="Phone"
            value={userForm.phone}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Accountant">Accountant</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <input
            type="text"
            placeholder="Username (login)"
            value={userForm.username}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <input
            type="text"
            placeholder="Password"
            value={userForm.password}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Status
            </label>
            <select
              value={userForm.status}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <button
            onClick={handleAddUser}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </SlidePanel>

      {/* --- EDIT USER PANEL --- */}
      <SlidePanel open={openEditUserPanel} onClose={() => setOpenEditUserPanel(false)}>
        <div className="p-7 space-y-5">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Edit user
          </h2>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <input
            type="text"
            placeholder="Phone"
            value={userForm.phone}
            onChange={(e) =>
              setUserForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Accountant">Accountant</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Username (login)
            </label>
            <input
              type="text"
              value={userForm.username}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Password
            </label>
            <input
              type="text"
              value={userForm.password}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Status
            </label>
            <select
              value={userForm.status}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <button
            onClick={handleUpdateUser}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </SlidePanel>

      {/* --- ADD VENDOR PANEL --- */}
      <SlidePanel open={openAddVendorPanel} onClose={() => setOpenAddVendorPanel(false)}>
        <div className="p-7 space-y-5">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Add vendor
          </h2>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Type
            </label>
            <select
              value={vendorForm.type}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Labour">Labour</option>
              <option value="Machinery">Machinery</option>
              <option value="Material">Material</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <input
            type="text"
            placeholder="Name"
            value={vendorForm.name}
            onChange={(e) =>
              setVendorForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <input
            type="text"
            placeholder="Contact"
            value={vendorForm.contact}
            onChange={(e) =>
              setVendorForm((prev) => ({ ...prev, contact: e.target.value }))
            }
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <button
            onClick={handleAddVendor}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </SlidePanel>

      {/* --- EDIT VENDOR PANEL --- */}
      <SlidePanel open={openEditVendorPanel} onClose={() => setOpenEditVendorPanel(false)}>
        <div className="p-7 space-y-5">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Edit vendor
          </h2>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Type
            </label>
            <select
              value={vendorForm.type}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
            >
              <option value="Labour">Labour</option>
              <option value="Machinery">Machinery</option>
              <option value="Material">Material</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={vendorForm.name}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Contact
            </label>
            <input
              type="text"
              value={vendorForm.contact}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, contact: e.target.value }))
              }
              className="w-full h-11 rounded-2xl border border-border bg-background px-4"
            />
          </div>

          <button
            onClick={handleUpdateVendor}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </SlidePanel>
    </>
  );
}