import { useState } from "react";
import ResolveComplaintModal from "../../pages/admin/ResolveComplaintModal";

export default function ComplaintTable({ complaints, onRefresh }) {
  const [resolveModal, setResolveModal] = useState({ open: false, id: "" });

  const openModal = (id) => setResolveModal({ open: true, id });
  const closeModal = () => setResolveModal({ open: false, id: "" });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-gray-600">
            <tr>
              <th>Category</th>
              <th>Flat</th>
              <th>Tenant</th>
              <th>Status</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t">
                <td>{c.category}</td>
                <td>{c.flat?.flatNumber}</td>
                <td>{c.tenant?.name}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      c.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="text-sm text-gray-600">{c.note || "-"}</td>
                <td>
                  {c.status === "pending" ? (
                    <button
                      onClick={() => openModal(c._id)}
                      className="text-blue-600 underline text-sm"
                    >
                      Resolve
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResolveComplaintModal
        isOpen={resolveModal.open}
        setIsOpen={closeModal}
        complaintId={resolveModal.id}
        onSuccess={onRefresh}
      />
    </>
  );
}
