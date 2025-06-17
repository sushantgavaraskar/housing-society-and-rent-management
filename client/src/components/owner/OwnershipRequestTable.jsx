export default function OwnershipRequestTable({ requests }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th>Flat</th>
              <th>To Email</th>
              <th>Status</th>
              <th>Note</th>
              <th>Admin Remark</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i} className="border-t">
                <td>{r.flat?.flatNumber}</td>
                <td>{r.newOwnerEmail}</td>
                <td>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      r.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="text-gray-700 text-sm">{r.note || "-"}</td>
                <td className="text-gray-500 text-xs">{r.adminRemark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  