import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('easyathlete_user_id');
    if (!userId) {
      setMessage('❌ No user ID found. Please complete onboarding first.');
      return;
    }

    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/auth/signup-with-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userId }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('easyathlete_mongo_id', data.userId); // ✅ Store MongoDB _id
        localStorage.setItem('strava_id', data.stravaId); // 👈 Add this
        setMessage('✅ Signup successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage(data.message || '❌ Signup failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Network error during signup.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create your EasyAthlete account</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign Up & Save My Plan
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
