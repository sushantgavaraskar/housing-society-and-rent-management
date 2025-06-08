import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SocietyList = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await api.get('/societies');
        setSocieties(res.data);
      } catch (err) {
        setError('Failed to load societies');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  if (loading) return <p>Loading societies...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>All Societies</h3>
      {societies.length === 0 ? (
        <p>No societies found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {societies.map(society => (
              <tr key={society._id}>
                <td>{society.name}</td>
                <td>{society.location}</td>
                <td>{new Date(society.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SocietyList;
