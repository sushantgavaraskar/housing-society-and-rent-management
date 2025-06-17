export default function RentTable({ rent }) {
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
            {rent.map((r, i) => (
              <tr key={i} className="border-t">
                <td>{r.flat?.flatNumber}</td>
                <td>{r.billingMonth}</td>
                <td>₹{r.amount}</td>
                <td>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    r.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {r.paid ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  