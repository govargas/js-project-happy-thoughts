import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export default function Form({ onSubmitThought }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = e => {
    setMessage(e.target.value)
    setError(null)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const trimmed = message.trim()
    if (trimmed.length < 5 || trimmed.length > 140) {
      setError('Message must be 5–140 characters.')
      return
    }
    setSubmitting(true)
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/thoughts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: trimmed })
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('You must be logged in to post a thought.')
        }
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Failed to send')
          })
        }
        return res.json()
      })
      .then(json => {
        // Immediately show the new thought card
        onSubmitThought(json.response)
        setMessage('')
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-100 p-6 rounded-xs border shadow-sharp mb-8"
    >
      <label htmlFor="happy-input" className="block mb-2 text-lg font-ivymode">
        What’s making you happy right now?
      </label>
      <textarea
        id="happy-input"
        value={message}
        onChange={handleChange}
        disabled={submitting}
        minLength={5}
        maxLength={140}
        rows={3}
        placeholder="Type your happy thought here…"
        className="w-full border p-3 mb-2 bg-white font-eixample resize-none focus:outline-none focus:ring-2 focus:ring-pink-200"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'error-message' : undefined}
      />
      <p className={`${message.length >= 140 ? 'text-red-500' : 'text-gray-500'} text-right text-sm`}>
        {140 - message.length}/140
      </p>
      {error && (
        <p id="error-message" role="alert" className="text-red-500 text-sm mb-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="bg-rose-300 hover:bg-pink-400 text-black font-ivymode px-8 py-2 rounded-full tracking-wide"
      >
        {submitting ? 'Sending…' : '❤️ Send Happy Thought ❤️'}
      </button>
    </form>
  )
}