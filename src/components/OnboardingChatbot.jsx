// src/components/OnboardingChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingChatbot({ onComplete }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: 'Hi! What’s your main goal for training right now?' }]);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (text) => {
  let userId = localStorage.getItem('easyathlete_user_id');

  // ✅ Create userId early if it doesn't exist
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    localStorage.setItem('easyathlete_user_id', userId);
    console.log('🆕 Generated userId early:', userId);
  }

  const updatedMessages = [...messages, { role: 'user', content: text }];
  setMessages(updatedMessages);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('https://easyathlete-backend-production.up.railway.app/onboarding-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        conversation: updatedMessages
      })
    });

    const data = await res.json();
    const newMessages = [...updatedMessages, { role: 'assistant', content: data.reply }];
    setMessages(newMessages);

    if (data.finished) {
      await uploadFinalOnboarding(userId, newMessages);
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
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-3 rounded shadow ${
              msg.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-white self-start text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t p-4 bg-white sticky bottom-0">
        <input
          className="border p-2 w-full rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && input && !loading && sendMessage(input)}
          placeholder="Type your answer and press Enter"
          disabled={loading}
        />
        {loading && <div className="text-sm text-gray-500 mt-2">Thinking...</div>}
      </div>
    </div>
  );
}
