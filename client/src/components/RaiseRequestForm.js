import React, { useState } from 'react';
import api from '../services/api';

const RaiseRequestForm = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await api.post('/requests', { description });
      setMsg('Request raised successfully!');
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to raise request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">Raise a Maintenance Request</div>
      <div className="card-body">
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Request Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseRequestForm;
