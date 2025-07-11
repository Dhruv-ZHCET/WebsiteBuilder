// pages/Login.tsx
import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(form);
      localStorage.setItem('authToken', response.data.token);
      alert('Login successful');
      navigate('/builder');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 w-full" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="bg-green-500 text-white p-2 w-full rounded" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
