import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/my');
        setPayments(res.data);
      } catch (err) {
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Payment History</h3>

      {error && <p className="text-danger fw-semibold">{error}</p>}
      {loading && <p>Loading payment history...</p>}

      {!loading && !error && (
        <>
          {payments.length === 0 ? (
            <p className="text-muted">You have not made any payments yet.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Payment Date</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment._id}>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>{payment.property?.name || payment.property?.address || `Property ${payment.property?._id || ''}`}</td>
                    <td>₹{payment.amount.toFixed(2)}</td>
                    <td>{payment.paymentType}</td>
                    <td>{payment.paymentMode}</td>
                    <td>
                      <span className={
                        payment.status === 'Completed' ? 'badge bg-success' :
                        payment.status === 'Pending' ? 'badge bg-warning text-dark' :
                        'badge bg-secondary'
                      }>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
