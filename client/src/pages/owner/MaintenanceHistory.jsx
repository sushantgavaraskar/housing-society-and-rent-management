import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import MaintenanceTable from "../../components/owner/MaintenanceTable";
import API from "../../lib/axios";
import { toast } from "sonner";

export default function MaintenanceHistory() {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/owner/maintenance/my")
      .then(res => setMaintenance(res.data.data))
      .catch(() => toast.error("Failed to fetch maintenance"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Maintenance Charges">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : maintenance.length ? (
          <MaintenanceTable maintenance={maintenance} />
        ) : (
          <p>No records found.</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
