import API from "../../lib/axios";
import { toast } from "sonner";

export default function RentTable({ rents, onRefresh }) {
  const handlePay = async (id) => {
    try {
      await API.put(`/tenant/rent/pay/${id}`);
      toast.success("Rent marked as paid");
      onRefresh();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th>Flat</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rents.map((r) => (
            <tr key={r._id} className="border-t">
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
              <td>
                {!r.paid ? (
                  <button
                    onClick={() => handlePay(r._id)}
                    className="text-blue-600 underline text-sm"
                  >
                    Pay Now
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
  );
}
