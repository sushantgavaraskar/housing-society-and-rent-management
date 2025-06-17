import { useEffect, useState } from "react";
import API from "../../lib/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageContainer from "../../components/shared/PageContainer";
import BuildingFormModal from "../../components/admin/BuildingFormModal";
import BuildingTable from "../../components/admin/BuildingTable";
import { toast } from "sonner";

export default function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const [societyRes, buildingRes] = await Promise.all([
        API.get("/admin/societies/my"),
        API.get("/admin/societies/my").then(res =>
          Promise.all(res.data.data.map(s =>
            API.get(`/admin/societies/${s._id}/buildings`) // Optional: if you had per-society endpoint
          ))
        ).then(res =>
          res.flatMap((r) => r.data.data)
        )
      ]);
      setSocieties(societyRes.data.data);
      setBuildings(buildingRes);
    } catch (err) {
      toast.error("Error fetching buildings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <PageContainer title="Manage Buildings">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Building
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : buildings.length ? (
          <BuildingTable buildings={buildings} onRefresh={fetchData} />
        ) : (
          <p className="text-gray-600">No buildings found.</p>
        )}

        <BuildingFormModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          societies={societies}
          onSuccess={fetchData}
        />
      </PageContainer>
    </DashboardLayout>
  );
}
