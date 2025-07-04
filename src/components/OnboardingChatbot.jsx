import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingChatbot({ onComplete }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  useEffect(() => {
    let userId = localStorage.getItem('easyathlete_user_id');
    if (!userId) {
      userId = `user_${crypto.randomUUID()}`;
      localStorage.setItem('easyathlete_user_id', userId);
      console.log('🆕 Generated userId at onboarding start:', userId);
    }

    const storedMessages = localStorage.getItem('easyathlete_onboarding_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([{ role: 'assistant', content: 'Hi! What’s your main goal for training right now?' }]);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (messages.length > 0) {
      localStorage.setItem('easyathlete_onboarding_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const userId = localStorage.getItem('easyathlete_user_id');
    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/onboarding-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, conversation: updatedMessages })
      });

      const data = await res.json();
      const newMessages = [...updatedMessages, { role: 'assistant', content: data.reply }];
      setMessages(newMessages);

      if (data.finished) {
        await uploadFinalOnboarding(userId, newMessages);
        setShowSignup(true);
      }
    } catch (err) {
      console.error('❌ Error sending onboarding message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const userId = localStorage.getItem('easyathlete_user_id');
    if (!userId || !email || !password || !name) {
      setSignupMessage('❌ Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/auth/signup-with-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, userId })
      });

      const data = await res.json();
      if (!res.ok) {
        setSignupMessage(data.message || '❌ Signup failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('easyathlete_user_id', data.userId);
      navigate('/generate');
    } catch (err) {
      setSignupMessage('❌ Network error');
    }
  };

  const uploadFinalOnboarding = async (userId, conversation) => {
    try {
      await fetch('https://easyathlete-backend-production.up.railway.app/upload-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, onboardingData: conversation })
      });

      localStorage.setItem('onboarding_answers', JSON.stringify(conversation));
      localStorage.removeItem('easyathlete_onboarding_messages');
    } catch (err) {
      console.error('❌ Failed to upload final onboarding conversation:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {showSignup ? (
        <div className="p-6 space-y-4 max-w-md mx-auto mt-12">
          <h2 className="text-xl font-bold">Create your EasyAthlete account</h2>
          <input className="border p-2 w-full rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" onClick={handleSignup}>
            Sign up
          </button>
          {signupMessage && <p className="text-red-500 text-sm">{signupMessage}</p>}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <div
                  className={`max-w-xs p-3 rounded shadow ${
                    msg.role === 'user'
                      ? 'bg-blue-100 self-end text-right'
                      : 'bg-white self-start text-left'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'assistant' && idx === 2 && (
                  <div className="self-start mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      🚴 Let’s make this even more personal by connecting your Strava account.
                    </p>
                    <a
                      href={`https://www.strava.com/oauth/authorize?client_id=161074&response_type=code&redirect_uri=${encodeURIComponent(
                        window.location.hostname === 'localhost'
                          ? 'http://localhost:5173/strava-redirect'
                          : 'https://easyathlete-clean.vercel.app/strava-redirect'
                      )}&scope=read,activity:read_all&state=${localStorage.getItem('easyathlete_user_id')}`}
                    className="inline-block"
                    >
                      <img
                        src="/assets/strava/connect_with_strava.png"
                        alt="Connect with Strava"
                        className="h-12 w-auto"
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t p-4 bg-white sticky bottom-0">
            <input
              ref={inputRef}
              className="border p-2 w-full rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && input && !loading && sendMessage(input)}
              placeholder="Type your answer and press Enter"
              disabled={loading}
            />
            {loading && <div className="text-sm text-gray-500 mt-2">Writing...</div>}
          </div>
        </>
      )}
    </div>
  );
}
