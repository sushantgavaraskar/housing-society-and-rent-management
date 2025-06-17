import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import DashboardCard from "../../components/owner/DashboardCard";
import { toast } from "sonner";
import { Home, Users, Wallet, AlertCircle } from "lucide-react";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/owner/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Failed to load dashboard"));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Owner Overview">
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="My Flats" value={data.flatCount} icon={<Home />} />
            <DashboardCard title="Total Tenants" value={data.tenantCount} icon={<Users />} />
            <DashboardCard title="Unpaid Rents" value={data.unpaidRentCount} icon={<Wallet />} />
            <DashboardCard title="Pending Complaints" value={data.pendingComplaints} icon={<AlertCircle />} />
          </div>
        ) : (
          <p className="text-gray-500">Loading dashboard...</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
