import React, { useState } from 'react';
import Form from './components/Form.jsx';

export const App = () => {
  // State array of strings for now
  const [thoughts, setThoughts] = useState([
    // dummy placeholders while I build out the list
    'I’m happy because we just moved into a new apartment!',
    'It’s my birthday!!!',
    'I’m happy because the sun is out :)'
  ]);

  // Called when Form submits a new thought
  const addThought = (newMessage) => {
    setThoughts([newMessage, ...thoughts]);
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <Form onSubmitThought={addThought} />

      {/* Render the list of thoughts */}
      {thoughts.map((msg, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-lg shadow mb-4 font-eixample"
        >
          <p>{msg}</p>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            {/* Placeholder heart + count */}
            <span className="bg-pink-100 rounded-full px-2 py-1">❤️ x 0</span>
            <span>just now</span>
          </div>
        </div>
      ))}
    </main>
  );
};