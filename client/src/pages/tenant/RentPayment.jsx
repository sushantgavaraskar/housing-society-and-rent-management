import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import RentTable from "../../components/tenant/RentTable";
import { toast } from "sonner";

export default function RentPayments() {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/tenant/rent/my");
      setRents(res.data.data);
    } catch {
      toast.error("Failed to load rents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRents();
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="My Rent Payments">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : rents.length ? (
          <RentTable rents={rents} onRefresh={loadRents} />
        ) : (
          <p>No rent records available.</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
