import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
      <div className="text-sm text-gray-600">
        Welcome, <span className="font-medium">{user?.name}</span>
      </div>
    </div>
  );
}
