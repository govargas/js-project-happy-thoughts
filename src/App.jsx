import React, { useState, useEffect } from 'react';
import Form from './components/Form.jsx';
import ThoughtCard from './components/ThoughtCard.jsx'

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
    <main className="max-w-lg w-full mx-auto p-4">
      <Form onSubmitThought={addThought} />

      {/* Render the list of thoughts, might move later to a "ThoughtsCard.jsx" or similar */}
      {thoughts.map((msg, i) => (
        <article
          key={i}
          className="
            bg-white
            p-6
            rounded-xs
            border
            shadow-sharp
            mb-6
            font-eixample
          "
        >
          <p className="text-gray-800 mb-4">{msg}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            {/* Placeholder heart + count */}
            <div className="flex items-center space-x-2">
              <span
                className="
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  bg-gray-200    /* unliked state */
                "
              >
                ❤️
              </span>
              <span>x 0</span>
            </div>
            {/* Timestamp */}
            <span>just now</span>
          </div>
        </article>
      ))}
    </main>
  );
};