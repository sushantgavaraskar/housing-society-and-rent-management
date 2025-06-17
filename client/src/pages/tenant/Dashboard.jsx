import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import DashboardCard from "../../components/tenant/DashboardCard";
import { toast } from "sonner";
import { Wallet, FileText, AlertTriangle } from "lucide-react";

export default function TenantDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/tenant/dashboard")
      .then(res => setData(res.data.data))
      .catch(() => toast.error("Failed to load dashboard"));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Tenant Overview">
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Unpaid Rents" value={data.unpaidRents} icon={<Wallet />} />
            <DashboardCard title="Unpaid Maintenance" value={data.unpaidMaintenance} icon={<FileText />} />
            <DashboardCard title="Open Complaints" value={data.openComplaints} icon={<AlertTriangle />} />
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
