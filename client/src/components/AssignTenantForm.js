import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AssignTenantForm = () => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, tenantRes] = await Promise.all([
          api.get('/properties/my'),
          api.get('/auth/tenants'), // You must have this route returning all tenant users
        ]);
        setProperties(propRes.data);
        setTenants(tenantRes.data);
      } catch (err) {
        setMessage('Failed to load data.');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedProperty || !selectedTenant) {
      setMessage('Please select both property and tenant.');
      return;
    }

    try {
      await api.put(`/properties/${selectedProperty}/rent`, {
        tenantId: selectedTenant,
      });
      setMessage('Tenant assigned successfully.');
      setSelectedProperty('');
      setSelectedTenant('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Assignment failed');
    }
  };

  return (
    <div className="card p-4 mt-4 shadow">
      <h4>Assign Tenant to Property</h4>

      {message && <div className="alert alert-info mt-2">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Select Property</label>
          <select
            className="form-select"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            required
          >
            <option value="">-- Select Property --</option>
            {properties.map((prop) => (
              <option key={prop._id} value={prop._id}>
                {prop.name} — {prop.address}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select Tenant</label>
          <select
            className="form-select"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            required
          >
            <option value="">-- Select Tenant --</option>
            {tenants.map((tenant) => (
              <option key={tenant._id} value={tenant._id}>
                {tenant.name} — {tenant.email}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success" type="submit">
          Assign Tenant
        </button>
      </form>
    </div>
  );
};

export default AssignTenantForm;
