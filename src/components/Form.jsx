import React, { useState } from 'react';

const Form = ({ onSubmitThought }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   // Simple client‐side validation
    if (message.trim().length < 5 || message.trim().length > 140) {
      setError('Message must be 5–140 characters.');
      return;
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-zinc-100       /* light grey background */
        p-6                /* inner padding */
        rounded-xs        /* subtle rounded corners */
        border
        shadow-sharp
        mb-8               /* space below */
      "
    >

      <label
        htmlFor="happy-input"
        className="block mb-2 bg-zinc-100 text-lg font-ivymode"
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
        className="
          w-full
          border border-gray-300
          p-3
          mb-2
          bg-white
          font-eixample
          resize-none
          ring-1 ring-stone-300
          focus:outline-none focus:ring-2 focus:ring-pink-200
        "
      />

      <button
        type="submit"
        className="
          bg-rose-300 hover:bg-pink-400
          text-black
          font-ivymode
          px-8 py-2
          rounded-full
          tracking-wide
        "
      >
        ❤️ Send Happy Thought ❤️
      </button>
    </form>
  );
};

export default Form;