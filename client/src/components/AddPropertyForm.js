import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const AddPropertyForm = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rentAmount: '',
    societyId: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const res = await api.post('/properties', {
        name: formData.name,
        address: formData.address,
        rentAmount: parseFloat(formData.rentAmount),
        societyId: formData.societyId,
      });

      setSuccess('Property added successfully!');
      setFormData({ name: '', address: '', rentAmount: '', societyId: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="card p-4 mt-3 shadow">
      <h3 className="mb-3">Add Property</h3>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Property Name/Number</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Address / Description</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Monthly Rent Amount</label>
          <input
            type="number"
            className="form-control"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Society ID</label>
          <input
            type="text"
            className="form-control"
            name="societyId"
            value={formData.societyId}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
