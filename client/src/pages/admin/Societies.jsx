import { useEffect, useState } from "react";
import API from "../../lib/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import SocietyFormModal from "../../components/admin/SocietyFormModal";
import SocietyTable from "../../components/admin/SocietyTable";
import { toast } from "sonner";

export default function Societies() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSocieties = async () => {
    try {
      const res = await API.get("/admin/societies/my");
      setSocieties(res.data.data);
    } catch (err) {
      toast.error("Failed to load societies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="My Societies">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Society
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : societies.length ? (
          <SocietyTable societies={societies} />
        ) : (
          <p className="text-gray-600">No societies found.</p>
        )}

        <SocietyFormModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          onSuccess={fetchSocieties}
        />
      </PageContainer>
    </DashboardLayout>
  );
}
