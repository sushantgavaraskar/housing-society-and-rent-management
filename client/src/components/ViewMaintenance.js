import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ViewMaintenance = () => {
  const { user } = useContext(AuthContext);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await api.get('/maintenance/my'); // fetches logged-in tenant's records
        setMaintenanceList(res.data);
      } catch (err) {
        setError('Failed to load maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  if (loading) return <p>Loading maintenance records...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>My Maintenance Records</h3>
      {maintenanceList.length === 0 ? (
        <p>No maintenance records found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Society</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceList.map((item) => (
              <tr key={item._id}>
                <td>{item.society?.name || 'N/A'}</td>
                <td>{item.month || 'N/A'}</td>
                <td>₹{item.amount.toFixed(2)}</td>
                <td>
                  <span className={
                    item.status === 'Paid' ? 'badge bg-success' :
                    item.status === 'Unpaid' ? 'badge bg-danger' :
                    'badge bg-secondary'
                  }>
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewMaintenance;
