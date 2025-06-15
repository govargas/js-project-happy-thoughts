import React, { useState } from 'react'
import { useNavigate } from 'react-router'
const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error || 'Login failed')
    } else {
      localStorage.setItem('token', json.token)
      navigate('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <label className="block mb-2">
        Username
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </label>
      <label className="block mb-4">
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </label>

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Log in
      </button>
    </form>
  )
}