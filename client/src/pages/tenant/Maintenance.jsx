import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import MaintenanceTable from "../../components/tenant/MaintenanceTable";
import { toast } from "sonner";

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/tenant/maintenance/my");
      setRecords(res.data.data);
    } catch {
      toast.error("Failed to load maintenance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Maintenance Charges">
        {loading ? (
          <p>Loading...</p>
        ) : records.length ? (
          <MaintenanceTable records={records} onRefresh={fetchData} />
        ) : (
          <p>No records available</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
