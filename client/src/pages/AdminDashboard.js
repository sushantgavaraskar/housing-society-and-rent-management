import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [societies, setSocieties] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setSocieties(res.data.societies);
      } catch (err) {
        console.error('Error loading admin dashboard:', err.message);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <ul className="list-group">
        {societies.map((soc) => (
          <li key={soc._id} className="list-group-item">
            <strong>{soc.name}</strong> - {soc.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
