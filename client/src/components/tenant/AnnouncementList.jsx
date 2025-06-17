export default function AnnouncementList({ items }) {
    return (
      <div className="space-y-4">
        {items.map((a) => (
          <div key={a._id} className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="text-gray-600 text-sm">{a.message}</p>
            <p className="text-xs text-gray-400 mt-2">Valid till: {a.expiryDate?.slice(0, 10)}</p>
          </div>
        ))}
      </div>
    );
  }
  