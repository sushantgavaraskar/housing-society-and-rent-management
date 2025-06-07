// src/components/Navbar.js
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">HousingSociety</Link>
      
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
                </li>
              )}
              {user.role === 'tenant' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/tenant/dashboard">Tenant Dashboard</Link>
                </li>
              )}
              {user.role === 'owner' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/owner/dashboard">Owner Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm ms-3">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
