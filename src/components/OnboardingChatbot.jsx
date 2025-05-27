// src/components/OnboardingChatbot.jsx
import React, { useState } from 'react';

const questions = [
  {
    key: 'goal',
    text: 'What is your main fitness goal?',
    type: 'text'
  },
  {
    key: 'deadline',
    text: 'By when do you want to achieve this goal?',
    type: 'text'
  },
  {
    key: 'level',
    text: 'How would you describe your current fitness level?',
    type: 'options',
    options: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    key: 'daysPerWeek',
    text: 'How many days a week do you want to train?',
    type: 'options',
    options: ['1-2', '3-4', '5-6', 'Every day']
  },
  {
    key: 'sports',
    text: 'Which sports do you want to include in your training plan?',
    type: 'multi-select',
    options: ['Running', 'Cycling', 'Swimming', 'Strength', 'Walking']
  },
  {
    key: 'restrictions',
    text: 'Do you have any injuries or restrictions we should know about?',
    type: 'text'
  }
];

export default function OnboardingChatbot({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState('');
  const [multiSelect, setMultiSelect] = useState([]);

  const current = questions[step];

  const handleNext = (value) => {
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);
    setInput('');
    setMultiSelect([]);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      onComplete(updated);
    }
  };

  const toggleMulti = (item) => {
    setMultiSelect((prev) =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div className="text-lg font-medium">{current.text}</div>

      {current.type === 'text' && (
        <div>
          <input
            className="border p-2 w-full rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input && handleNext(input)}
            placeholder="Type your answer and press Enter"
          />
        </div>
      )}

      {current.type === 'options' && (
        <div className="space-y-2">
          {current.options.map((option) => (
            <button
              key={option}
              className="block w-full bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded"
              onClick={() => handleNext(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {current.type === 'multi-select' && (
        <div className="space-y-2">
          {current.options.map((option) => (
            <label key={option} className="block">
              <input
                type="checkbox"
                checked={multiSelect.includes(option)}
                onChange={() => toggleMulti(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
          <button
            disabled={multiSelect.length === 0}
            onClick={() => handleNext(multiSelect)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
