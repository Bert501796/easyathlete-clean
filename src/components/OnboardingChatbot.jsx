// src/components/OnboardingChatbot.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingChatbot({ onComplete }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: 'Hi! What’s your main goal for training right now?' }]);
  }, []);

  const sendMessage = async (text) => {
    const userId = localStorage.getItem('easyathlete_user_id'); // may be null initially
    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/onboarding-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || null, // send null if not present
          conversation: updatedMessages
        })
      });

      const data = await res.json();
      const newMessages = [...updatedMessages, { role: 'assistant', content: data.reply }];
      setMessages(newMessages);

      if (data.finished) {
        let finalUserId = userId;
        if (!finalUserId) {
          finalUserId = `user_${crypto.randomUUID()}`;
          localStorage.setItem('easyathlete_user_id', finalUserId);
          console.log('🆕 Generated userId:', finalUserId);
        }

        await uploadFinalOnboarding(finalUserId, newMessages);
        onComplete(newMessages);
      }
    } catch (err) {
      console.error('❌ Error sending onboarding message:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFinalOnboarding = async (userId, conversation) => {
    try {
      await fetch('https://easyathlete-backend-production.up.railway.app/upload-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, onboardingData: conversation })
      });
    } catch (err) {
      console.error('❌ Failed to upload final onboarding conversation:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div className="space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <input
        className="border p-2 w-full rounded mt-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && input && !loading && sendMessage(input)}
        placeholder="Type your answer and press Enter"
        disabled={loading}
      />

      {loading && <div className="text-sm text-gray-500">Thinking...</div>}
    </div>
  );
}
