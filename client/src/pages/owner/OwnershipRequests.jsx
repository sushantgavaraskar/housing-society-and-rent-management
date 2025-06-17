import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import OwnershipRequestForm from "../../components/owner/OwnershipRequestForm";
import OwnershipRequestTable from "../../components/owner/OwnershipRequestTable";
import API from "../../lib/axios";
import { toast } from "sonner";

export default function OwnershipRequests() {
  const [ownedFlats, setOwnedFlats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [flatsRes, reqsRes] = await Promise.all([
        API.get("/owner/my-flats"),
        API.get("/owner/ownership-request/my")
      ]);
      setOwnedFlats(flatsRes.data.data);
      setRequests(reqsRes.data.data);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Ownership Requests">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <OwnershipRequestForm ownedFlats={ownedFlats} onSuccess={loadData} />
            <OwnershipRequestTable requests={requests} />
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
