import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import RentTable from "../../components/owner/RentTable";
import API from "../../lib/axios";
import { toast } from "sonner";

export default function RentHistory() {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/owner/rent/my")
      .then(res => setRent(res.data.data))
      .catch(() => toast.error("Failed to fetch rent history"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="My Rent History">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : rent.length ? (
          <RentTable rent={rent} />
        ) : (
          <p>No rent records found.</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
