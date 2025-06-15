import React, { useState } from 'react'
import { useNavigate } from 'react-router'
const API_URL = import.meta.env.VITE_API_URL

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setFieldErrors({});
    setServerError('');
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const json = await res.json()
    if (!res.ok) {
      const errs = json.errors ?? [];
      const fieldErrs = {};
      errs.forEach(e => {
        fieldErrs[e.param] = e.msg;
      });
      setFieldErrors(fieldErrs);
      setServerError(json.error || '');
    } else {
      navigate('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Register</h2>

      {serverError && <p className="text-red-500 text-sm mb-2">{serverError}</p>}

      <label className="block mb-2">
        Username
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2"
        />
        {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username}</p>}
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
        {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
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
        {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
      </label>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Sign up
      </button>
    </form>
  )
}