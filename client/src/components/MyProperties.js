import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties/my');
        setProperties(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch properties');
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="card p-4 mt-4 shadow">
      <h4>My Properties</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Rent</th>
                <th>Society</th>
                <th>Tenant</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop._id}>
                  <td>{prop.name}</td>
                  <td>{prop.address}</td>
                  <td>₹{prop.rentAmount}</td>
                  <td>{prop.society?.name || prop.society || 'N/A'}</td>
                  <td>{prop.tenant ? prop.tenant.name : 'Not Assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
