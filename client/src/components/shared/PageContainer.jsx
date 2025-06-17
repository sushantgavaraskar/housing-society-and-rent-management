export default function PageContainer({ title, children }) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="bg-white rounded shadow p-4">{children}</div>
      </div>
    );
  }
  