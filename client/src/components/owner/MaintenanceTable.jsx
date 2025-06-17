export default function MaintenanceTable({ maintenance }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th>Flat</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map((m, i) => (
              <tr key={i} className="border-t">
                <td>{m.flat?.flatNumber}</td>
                <td>{m.billingMonth}</td>
                <td>₹{m.amount}</td>
                <td>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    m.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {m.paid ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  