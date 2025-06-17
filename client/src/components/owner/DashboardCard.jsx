export default function DashboardCard({ title, value, icon }) {
    return (
      <div className="bg-white p-5 shadow rounded flex items-center gap-4">
        <div className="text-blue-600 text-3xl">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    );
  }
  