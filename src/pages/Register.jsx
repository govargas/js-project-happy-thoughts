import React, { useState } from 'react'
import { useNavigate } from 'react-router'
const API_URL = import.meta.env.VITE_API_URL

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState([])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors([])
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const json = await res.json()
    if (!res.ok) {
      // errors from express-validator come in json.errors
      setErrors(json.errors?.map(e => e.msg) ?? [json.error])
    } else {
      navigate('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Register</h2>

      {errors.map((m,i) => (
        <p key={i} className="text-red-500 text-sm">{m}</p>
      ))}

      <label className="block mb-2">
        Username
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </label>
      <label className="block mb-2">
        Email
        <input
          type="email"
          name="email"
          value={form.email}
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

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Sign up
      </button>
    </form>
  )
}