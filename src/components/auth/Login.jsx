import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('easyathlete_user_id', data.customUserId || ''); // for compatibility
        localStorage.setItem('easyathlete_mongo_id', data.userId); // ✅ NEW: store real MongoDB ID
        localStorage.setItem('strava_id', data.stravaId); // 👈 Add this
        setMessage('✅ Login successful!');
        navigate('/dashboard');
      } else {
        setMessage(data.message || '❌ Login failed');
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
