import Sidebar from "../components/shared/Sidebar";
import Topbar from "../components/shared/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
