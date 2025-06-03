import React, { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('✅ Signup successful!');
      } else {
        setMessage(data.message || '❌ Error during signup');
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
