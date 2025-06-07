import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const PaymentForm = () => {
  const { user } = useContext(AuthContext);

  const [societies, setSocieties] = useState([]);
  const [paymentType, setPaymentType] = useState('rent');
  const [amount, setAmount] = useState('');
  const [societyId, setSocietyId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await api.get('/societies');
        setSocieties(response.data);
        if (response.data.length > 0) setSocietyId(response.data[0]._id);
      } catch (error) {
        console.error('Error fetching societies:', error);
      }
    };
    fetchSocieties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!amount || !societyId) {
      setMessage('Please enter all required fields.');
      return;
    }

    try {
      const response = await api.post('/payments/pay', {
        amount: parseFloat(amount),
        paymentType,
        societyId,
      });

      setMessage('Payment successful!');
      setAmount('');
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Payment failed. Please try again.');
    }
  };

  return (
    <div className="container mt-3">
      <h4>Make a Payment</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="paymentType" className="form-label">Payment Type</label>
          <select
            id="paymentType"
            className="form-select"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="rent">Rent</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="society" className="form-label">Select Society</label>
          <select
            id="society"
            className="form-select"
            value={societyId}
            onChange={(e) => setSocietyId(e.target.value)}
          >
            {societies.map((soc) => (
              <option key={soc._id} value={soc._id}>{soc.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default PaymentForm;
