import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AddMaintenanceForm = () => {
  const [societyId, setSocietyId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [societies, setSocieties] = useState([]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await api.get('/societies');
        setSocieties(res.data);
      } catch (error) {
        console.error('Failed to fetch societies', error);
      }
    };
    fetchSocieties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await api.post('/maintenance', {
        society: societyId,
        description,
        amount: parseFloat(amount),
        date,
      });
      setMsg('Maintenance record added successfully!');
      setSocietyId('');
      setDescription('');
      setAmount('');
      setDate('');
    } catch (err) {
      console.error('Error adding maintenance:', err);
      setMsg('Failed to add maintenance.');
    }
    setLoading(false);
  };

  return (
    <div className="card mt-4">
      <div className="card-header">Add Maintenance Record</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="society" className="form-label">Society</label>
            <select
              id="society"
              className="form-select"
              value={societyId}
              onChange={(e) => setSocietyId(e.target.value)}
              required
            >
              <option value="">Select Society</option>
              {societies.map((soc) => (
                <option key={soc._id} value={soc._id}>{soc.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {msg && <p className={`mt-2 fw-bold ${msg.includes('successfully') ? 'text-success' : 'text-danger'}`}>{msg}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Maintenance'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceForm;
