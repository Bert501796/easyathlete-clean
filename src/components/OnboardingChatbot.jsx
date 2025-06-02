// src/components/OnboardingChatbot.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingChatbot({ onComplete }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! What’s your main fitness goal?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    if (!userId) {
      console.warn('⛔ No userId found, redirecting to homepage.');
      navigate('/');
    }
  }, [navigate, userId]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(updatedMessages);
    setUserInput('');
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
      const reply = data.reply;
      const finished = data.finished;
      const updated = [...updatedMessages, { sender: 'bot', text: reply }];

      setMessages(updated);
      setConversation(updated);
      setLoading(false);

      if (finished) {
        await submitAndComplete(userId, updated);
      }
    } catch (err) {
      console.error('❌ Error fetching bot reply:', err);
      setLoading(false);
    }
  };

  const submitAndComplete = async (userId, fullConversation) => {
    console.log('📤 Finalizing onboarding:', { userId, conversation: fullConversation });

    try {
      const response = await fetch('https://easyathlete-backend-production.up.railway.app/upload-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, onboardingData: fullConversation })
      });

      if (!response.ok) {
        console.error('❌ Failed to upload onboarding data');
        return;
      }

      console.log('✅ Onboarding data uploaded');
      onComplete(fullConversation);
    } catch (error) {
      console.error('❌ Error uploading onboarding data:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-200'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex mt-4"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type your answer..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
