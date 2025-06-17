import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user || (role && user.role !== role)) return <Navigate to="/login" />;
  return <Outlet />;
};
