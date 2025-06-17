import { useState } from "react";
import API from "../../lib/axios";
import { toast } from "sonner";
import AssignOccupantModal from "./AssignOccupantModal";

export default function FlatTable({ flats, onRefresh }) {
  const [assignModal, setAssignModal] = useState({ open: false, flatId: "", type: "" });

  const openAssignModal = (flatId, type) => {
    setAssignModal({ open: true, flatId, type });
  };

  const remove = async (flatId, userType) => {
    if (!window.confirm(`Remove ${userType} from flat?`)) return;
    try {
      await API.put(`/admin/flats/remove-occupant`, { flatId, type: userType });
      toast.success("Removed successfully");
      onRefresh();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase">
            <tr>
              <th>Flat No</th>
              <th>Owner</th>
              <th>Tenant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((f, i) => (
              <tr key={i} className="border-t">
                <td>{f.flatNumber}</td>
                <td>{f.owner?.name || "-"}</td>
                <td>{f.tenant?.name || "-"}</td>
                <td className="flex gap-2 py-2">
                  {!f.owner ? (
                    <button
                      onClick={() => openAssignModal(f._id, "owner")}
                      className="text-blue-600 underline text-sm"
                    >
                      Assign Owner
                    </button>
                  ) : (
                    <button
                      onClick={() => remove(f._id, "owner")}
                      className="text-red-500 text-sm"
                    >
                      Remove Owner
                    </button>
                  )}
                  {!f.tenant ? (
                    <button
                      onClick={() => openAssignModal(f._id, "tenant")}
                      className="text-green-600 underline text-sm"
                    >
                      Assign Tenant
                    </button>
                  ) : (
                    <button
                      onClick={() => remove(f._id, "tenant")}
                      className="text-red-500 text-sm"
                    >
                      Remove Tenant
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignOccupantModal
        isOpen={assignModal.open}
        flatId={assignModal.flatId}
        type={assignModal.type}
        setIsOpen={() => setAssignModal({ ...assignModal, open: false })}
        onSuccess={onRefresh}
      />
    </>
  );
}
