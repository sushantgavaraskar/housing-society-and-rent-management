import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Building2, LogIn, UserPlus, ShieldCheck, User2, Home } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white px-6">
      {/* Hero Section */}
      <section className="flex items-center justify-center h-screen">
        <div className="max-w-3xl text-center space-y-6">
          <div className="flex justify-center text-blue-700 text-6xl">
            <Building2 size={60} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to <span className="text-blue-700">Housing Society Manager</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            A unified system for administrators, owners, and tenants to manage societies,
            rent, complaints, maintenance, and announcements — all in one place.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
            >
              <LogIn size={20} />
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 border border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded shadow"
            >
              <UserPlus size={20} />
              Register
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">About the System</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Our Housing Society Manager is built to streamline housing operations
            for all stakeholders. It provides transparency, efficiency, and simplicity
            for everyday management.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin */}
            <div className="bg-gray-50 p-6 rounded shadow">
              <ShieldCheck size={40} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Admins</h3>
              <p className="text-gray-600 text-sm">
                Create societies, assign roles, manage maintenance and complaints,
                and broadcast announcements across the system.
              </p>
            </div>

            {/* Owner */}
            <div className="bg-gray-50 p-6 rounded shadow">
              <User2 size={40} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Owners</h3>
              <p className="text-gray-600 text-sm">
                Manage your flats, assign tenants, monitor rent payments,
                and request ownership transfers — all in a few clicks.
              </p>
            </div>

            {/* Tenant */}
            <div className="bg-gray-50 p-6 rounded shadow">
              <Home size={40} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">For Tenants</h3>
              <p className="text-gray-600 text-sm">
                Pay rent and maintenance online, raise and track complaints,
                and receive timely announcements from your society.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
