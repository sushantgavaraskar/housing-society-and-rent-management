import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ComplaintsBySociety = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/requests/society/all'); // Adjust endpoint if needed
        setComplaints(res.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/requests/${id}/status`, { status: newStatus });
      setComplaints((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
    setUpdatingId(null);
  };

  if (loading) return <p>Loading complaints...</p>;

  if (complaints.length === 0) return <p>No complaints found.</p>;

  return (
    <div className="card mt-4">
      <div className="card-header">Complaints by Society</div>
      <div className="card-body table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Society</th>
              <th>Description</th>
              <th>Status</th>
              <th>Raised By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((req) => (
              <tr key={req._id}>
                <td>{req.society?.name || 'N/A'}</td>
                <td>{req.description}</td>
                <td>
                  <span
                    className={`badge ${
                      req.status === 'pending' ? 'bg-warning' : 'bg-success'
                    }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td>{req.raisedBy?.name || 'Unknown'}</td>
                <td>
                  {req.status === 'pending' && (
                    <button
                      className="btn btn-sm btn-success"
                      disabled={updatingId === req._id}
                      onClick={() => handleStatusChange(req._id, 'resolved')}
                    >
                      {updatingId === req._id ? 'Updating...' : 'Mark Resolved'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintsBySociety;
