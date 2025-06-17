import API from "../../lib/axios";
import { toast } from "sonner";

export default function BuildingTable({ buildings, onRefresh }) {
  const deleteBuilding = async (id) => {
    if (!window.confirm("Delete this building?")) return;
    try {
      await API.delete(`/admin/buildings/${id}`);
      toast.success("Deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-200 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Building</th>
            <th>Society</th>
            <th>Floors</th>
            <th>Flats</th>
            <th>Address Label</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {buildings.map((b, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{b.name}</td>
              <td>{b.society?.name}</td>
              <td>{b.totalFloors}</td>
              <td>{b.totalFlats}</td>
              <td>{b.addressLabel || "-"}</td>
              <td>
                <button
                  onClick={() => deleteBuilding(b._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
