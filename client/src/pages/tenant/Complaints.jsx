import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import { toast } from "sonner";
import ComplaintForm from "../../components/tenant/ComplaintForm";
import ComplaintTable from "../../components/tenant/ComplaintTable";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get("/tenant/complaints/my");
      setComplaints(res.data.data);
    } catch {
      toast.error("Error loading complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout>
      <PageContainer title="My Complaints">
        <ComplaintForm onSuccess={load} />
        {loading ? <p>Loading...</p> : <ComplaintTable complaints={complaints} />}
      </PageContainer>
    </DashboardLayout>
  );
}
