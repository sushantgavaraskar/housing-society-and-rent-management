import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests/my');
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading your requests...</p>;

  return (
    <div className="card mt-4">
      <div className="card-header">My Complaints / Maintenance Requests</div>
      <div className="card-body">
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Status</th>
                <th>Raised On</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{req.description}</td>
                  <td>
                    {req.status === 'pending' ? (
                      <span className="badge bg-warning">Pending</span>
                    ) : (
                      <span className="badge bg-success">Resolved</span>
                    )}
                  </td>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
