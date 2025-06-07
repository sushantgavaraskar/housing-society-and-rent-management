import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import AddPropertyForm from '../components/AddPropertyForm';
import MyProperties from '../components/MyProperties';
import AssignTenantForm from '../components/AssignTenantForm';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/owner');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name || 'Owner'}!</h2>

      {/* Dashboard summary */}
      {dashboardData && (
        <div className="mb-4">
          <p><strong>Total Properties:</strong> {dashboardData.totalProperties}</p>
          <p><strong>Rented Properties:</strong> {dashboardData.rentedProperties}</p>
        </div>
      )}

      {/* Add Property Form */}
      <AddPropertyForm />
      <MyProperties />
      <AssignTenantForm />

    </div>
  );
};

export default OwnerDashboard;
