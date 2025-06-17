export default function ComplaintTable({ complaints }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th>Category</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t">
                <td>{c.category}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    c.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{c.status}</span>
                </td>
                <td className="text-gray-600 text-xs">{c.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  