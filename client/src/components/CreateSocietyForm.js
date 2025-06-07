import React, { useState } from 'react';
import api from '../services/api';

const CreateSocietyForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await api.post('/societies', { name, address });
      setMsg('Society created successfully!');
      setName('');
      setAddress('');
    } catch (err) {
      console.error('Error creating society:', err);
      setMsg('Failed to create society.');
    }
    setLoading(false);
  };

  return (
    <div className="card mt-4">
      <div className="card-header">Create New Society</div>
      <div className="card-body">
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Society Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              className="form-control"
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows="3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Society'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSocietyForm;
