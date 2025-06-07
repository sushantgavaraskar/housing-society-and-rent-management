import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'tenant'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3>Register</h3>
      <div className="mb-3">
        <label>Name</label>
        <input name="name" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label>Email</label>
        <input name="email" type="email" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input name="password" type="password" className="form-control" onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label>Role</label>
        <select name="role" className="form-control" onChange={handleChange}>
          <option value="tenant">Tenant</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button className="btn btn-success">Register</button>
    </form>
  );
};

export default RegisterForm;
