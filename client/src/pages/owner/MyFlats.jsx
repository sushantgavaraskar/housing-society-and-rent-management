import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import { toast } from "sonner";
import MyFlatsTable from "../../components/owner/MyFlatsTable";

export default function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlats = async () => {
    try {
      const res = await API.get("/owner/my-flats");
      setFlats(res.data.data);
    } catch {
      toast.error("Failed to load flats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="My Flats">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : flats.length ? (
          <MyFlatsTable flats={flats} onRefresh={fetchFlats} />
        ) : (
          <p>No flats assigned to you.</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
