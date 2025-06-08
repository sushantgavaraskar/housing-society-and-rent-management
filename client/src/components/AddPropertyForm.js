import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rentAmount: '',
    societyId: ''
  });

  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await api.get('/societies');
        setSocieties(response.data);
      } catch (err) {
        setError('Failed to load societies');
      }
    };

    fetchSocieties();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        rentAmount: parseFloat(formData.rentAmount),
      };

      const response = await api.post('/properties', payload);
      setMessage('Property added successfully');
      setFormData({ name: '', address: '', rentAmount: '', societyId: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Property Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rentAmount" className="form-label">Rent Amount</label>
          <input
            type="number"
            className="form-control"
            id="rentAmount"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="societyId" className="form-label">Select Society</label>
          <select
            className="form-select"
            id="societyId"
            name="societyId"
            value={formData.societyId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Society --</option>
            {societies.map(society => (
              <option key={society._id} value={society._id}>
                {society.name} - {society.location}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Property'}
        </button>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddPropertyForm;
