import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./router/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import TenantDashboard from "./pages/tenant/Dashboard";
import Landing from "./pages/Landing";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Toaster richColors position="top-right"  />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Add more admin routes */}
        </Route>

        {/* Owner Routes */}
        <Route element={<PrivateRoute role="owner" />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          {/* Add more owner routes */}
        </Route>

        {/* Tenant Routes */}
        <Route element={<PrivateRoute role="tenant" />}>
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          {/* Add more tenant routes */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
