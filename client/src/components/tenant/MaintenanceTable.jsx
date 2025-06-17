import API from "../../lib/axios";
import { toast } from "sonner";

export default function MaintenanceTable({ records, onRefresh }) {
  const pay = async (id) => {
    try {
      await API.put(`/tenant/maintenance/pay/${id}`);
      toast.success("Payment successful");
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
            <th>Month</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((m) => (
            <tr key={m._id} className="border-t">
              <td>{m.billingMonth}</td>
              <td>₹{m.amount}</td>
              <td>
                <span className={`px-2 py-1 text-xs rounded ${
                  m.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{m.paid ? "Yes" : "No"}</span>
              </td>
              <td>
                {!m.paid && (
                  <button onClick={() => pay(m._id)} className="text-blue-600 underline text-sm">
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
