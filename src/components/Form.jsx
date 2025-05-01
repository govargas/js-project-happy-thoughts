import React, { useState } from 'react';

const Form = ({ onSubmitThought }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: not empty and <= 140 chars
    if (message.trim() && message.length <= 140) {
      onSubmitThought(message.trim());
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-6 rounded-lg shadow-md mb-6"
    >

      <label
        htmlFor="happy-input"
        className="block mb-2 text-lg font-ivymode"
      >
        What’s making you happy right now?
      </label>

      <textarea
        id="happy-input"
        value={message}
        onChange={handleChange}
        maxLength={140}
        rows={3}
        placeholder="Type your happy thought here…"
        className="w-full border border-gray-300 rounded p-2 mb-4 font-eixample resize-none"
      />

      <button
        type="submit"
        className="block mx-auto bg-pink-500 hover:bg-pink-600 text-white font-ivymode px-6 py-2 rounded-full"
      >
        ❤️ Send Happy Thought ❤️
      </button>
    </form>
  );
};

export default Form;