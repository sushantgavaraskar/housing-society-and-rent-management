import { Home, Users, Building, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../lib/axios";

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  const navItems = {
    admin: [
      { label: "Dashboard", path: "/admin/dashboard", icon: <Home /> },
      { label: "Societies", path: "/admin/societies", icon: <Building /> },
      { label: "Buildings", path: "/admin/buildings", icon: <Users /> },
      { label: "Settings", path: "/admin/settings", icon: <Settings /> }
    ],
    owner: [
      { label: "Dashboard", path: "/owner/dashboard", icon: <Home /> },
      { label: "My Flats", path: "/owner/my-flats", icon: <Building /> }
    ],
    tenant: [
      { label: "Dashboard", path: "/tenant/dashboard", icon: <Home /> },
      { label: "My Flat", path: "/tenant/my-flat", icon: <Building /> }
    ]
  };

  const links = navItems[user?.role] || [];

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white p-5 fixed left-0 top-0">
      <div className="text-xl font-bold mb-8">🏢 Housing Panel</div>

      <nav className="flex flex-col space-y-3">
        {links.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 ${
                isActive ? "bg-blue-900 font-semibold" : ""
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={logout}
          className="flex items-center gap-2 mt-8 text-red-300 hover:text-white"
        >
          <LogOut />
          Logout
        </button>
      </nav>
    </aside>
  );
}
