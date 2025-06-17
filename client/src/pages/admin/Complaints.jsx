import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import API from "../../lib/axios";
import ComplaintTable from "../../components/admin/ComplaintTable";
import { toast } from "sonner";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/complaints?status=${status}`);
      setComplaints(res.data.data);
    } catch {
      toast.error("Error loading complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [status]);

  return (
    <DashboardLayout>
      <PageContainer title="Complaints Management">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ComplaintTable complaints={complaints} onRefresh={fetchComplaints} />
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
