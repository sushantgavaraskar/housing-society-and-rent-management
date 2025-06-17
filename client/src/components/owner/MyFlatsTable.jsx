import { useState } from "react";
import API from "../../lib/axios";
import { toast } from "sonner";
import AssignTenantModal from "./AssignTenantModal";

export default function MyFlatsTable({ flats, onRefresh }) {
  const [modal, setModal] = useState({ open: false, flatId: "" });

  const openModal = (id) => setModal({ open: true, flatId: id });
  const closeModal = () => setModal({ open: false, flatId: "" });

  const removeTenant = async (flatId) => {
    if (!confirm("Remove tenant?")) return;
    try {
      await API.put("/owner/flats/remove-tenant", { flatId });
      toast.success("Tenant removed");
      onRefresh();
    } catch {
      toast.error("Failed to remove tenant");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th>Flat</th>
              <th>Tenant</th>
              <th>Building</th>
              <th>Society</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat._id} className="border-t">
                <td>{flat.flatNumber}</td>
                <td>{flat.tenant?.name || "-"}</td>
                <td>{flat.building?.name}</td>
                <td>{flat.society?.name}</td>
                <td>
                  {!flat.tenant ? (
                    <button
                      onClick={() => openModal(flat._id)}
                      className="text-blue-600 text-sm underline"
                    >
                      Assign Tenant
                    </button>
                  ) : (
                    <button
                      onClick={() => removeTenant(flat._id)}
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

      <AssignTenantModal
        isOpen={modal.open}
        setIsOpen={closeModal}
        flatId={modal.flatId}
        onSuccess={onRefresh}
      />
    </>
  );
}
