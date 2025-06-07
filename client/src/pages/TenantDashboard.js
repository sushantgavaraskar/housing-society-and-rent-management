import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TenantDashboard = () => {
  const [data, setData] = useState({ rent: null, maintenance: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/tenant');
        setData(res.data);
      } catch (err) {
        console.error('Error loading tenant dashboard:', err.message);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Tenant Dashboard</h2>
      {data.rent && (
        <div>
          <h4>Rent Info</h4>
          <p>Property: {data.rent.property.title}</p>
          <p>Amount: ₹{data.rent.property.rentAmount}</p>
        </div>
      )}
      <h4>Maintenance</h4>
      <ul className="list-group">
        {data.maintenance.map((m) => (
          <li key={m._id} className="list-group-item">
            {m.month} - ₹{m.amount} - {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TenantDashboard;
