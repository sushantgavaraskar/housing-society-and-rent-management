import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import RaiseRequestForm from '../components/RaiseRequestForm';
import MyRequests from '../components/MyRequests';
import PaymentForm from '../components/PaymentForm';
import PaymentHistory from '../components/PaymentHistory';

const TenantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/tenant');
        setSummary(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenant dashboard:', err);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name} (Tenant)</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Complaints Raised</div>
            <div className="card-body">
              <h5 className="card-title">{summary.totalRequests}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Resolved Complaints</div>
            <div className="card-body">
              <h5 className="card-title">{summary.resolvedRequests}</h5>
            </div>
          </div>
        </div>
      </div>
      <RaiseRequestForm onSuccess={() => console.log("Request submitted")} />
      <MyRequests />
      <PaymentForm type="rent" />
      <PaymentForm type="maintenance" />
      <PaymentHistory />

    </div>
  );
};

export default TenantDashboard;
