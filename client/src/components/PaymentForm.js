import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const PaymentForm = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Rent');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties/my');
        setProperties(res.data);
        if (res.data.length > 0) setSelectedProperty(res.data[0]._id);
      } catch (error) {
        console.error('Failed to fetch properties', error);
        setMessage({ type: 'error', text: 'Failed to load properties' });
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!selectedProperty) return;
    const prop = properties.find(p => p._id === selectedProperty);
    if (!prop) return;
    if (paymentType === 'Rent') setAmount(prop.rentAmount);
    else if (paymentType === 'Maintenance') setAmount(prop.maintenanceCharge || 0);
  }, [selectedProperty, paymentType, properties]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!selectedProperty || !amount || !paymentMode || !paymentDate) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setLoading(false);
      return;
    }
    try {
      const paymentData = {
        property: selectedProperty,
        amount: Number(amount),
        paymentType,
        paymentMode,
        paymentDate,
        tenant: user._id,
      };
      await api.post('/payments/pay', paymentData);
      setMessage({ type: 'success', text: 'Payment successful!' });
      // Reset fields
      setPaymentMode('Cash');
      setPaymentDate(new Date().toISOString().slice(0, 10));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Payment failed' });
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h3>Make a Payment</h3>
      
      {message && (
        <p className={`fw-bold mt-2 ${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="propertySelect" className="form-label">Select Property</label>
          <select
            id="propertySelect"
            className="form-select"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            required
          >
            {properties.map(prop => (
              <option key={prop._id} value={prop._id}>
                {prop.name || prop.address || `Property ${prop._id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="paymentType" className="form-label">Payment Type</label>
          <select
            id="paymentType"
            className="form-select"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            required
          >
            <option value="Rent">Rent</option>
            <option value="Maintenance">Maintenance</option>
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
            min="0"
            required
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="paymentMode" className="form-label">Payment Mode</label>
          <select
            id="paymentMode"
            className="form-select"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="paymentDate" className="form-label">Payment Date</label>
          <input
            type="date"
            id="paymentDate"
            className="form-control"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
