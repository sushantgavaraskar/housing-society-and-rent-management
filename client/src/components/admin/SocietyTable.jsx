export default function SocietyTable({ societies }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th>Registration</th>
              <th>City</th>
              <th>Maintenance</th>
            </tr>
          </thead>
          <tbody>
            {societies.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{s.name}</td>
                <td>{s.registrationNumber}</td>
                <td>{s.address.city}</td>
                <td>
                  ₹{s.maintenancePolicy.amountPerFlat} /{" "}
                  {s.maintenancePolicy.frequency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  