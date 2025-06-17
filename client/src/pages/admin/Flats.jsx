import { useEffect, useState } from "react";
import API from "../../lib/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import FlatTable from "../../components/admin/FlatTable";
import { toast } from "sonner";

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlats = async () => {
    try {
      const res = await API.get("/admin/flats/all"); // Assuming this route returns all flats
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
      <PageContainer title="Flat Assignments">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : flats.length ? (
          <FlatTable flats={flats} onRefresh={fetchFlats} />
        ) : (
          <p>No flats available</p>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
