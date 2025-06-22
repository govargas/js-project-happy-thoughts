import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const API_URL = import.meta.env.VITE_API_URL

export default function ThoughtCard({
  id,
  owner,
  message,
  hearts,
  createdAt,
  onLike,
  onDelete,
  onUpdate,
  isLiked,
  isNew,
  isOwner
}) {
  const token = localStorage.getItem('token')

  const handleLike = () => {
    if (!token) {
      return window.alert('You must log in to like a thought.')
    }
    if (isLiked) return

    fetch(`${API_URL}/thoughts/${id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not register like')
        return res.json()
      })
      .then(({ response }) => onLike(response))
      .catch(err => console.error('Like failed:', err))
  }

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this thought?')) return

    fetch(`${API_URL}/thoughts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed')
        return res.json()
      })
      .then(({ response }) => onDelete(response.deletedId))
      .catch(err => console.error('Delete failed:', err))
  }

  const handleEdit = () => {
    const newMsg = window.prompt('Edit your thought:', message)
    if (newMsg == null) return
    const trimmed = newMsg.trim()
    if (trimmed.length < 5 || trimmed.length > 140) {
      return window.alert('Thought must be between 5 and 140 characters.')
    }

    fetch(`${API_URL}/thoughts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: trimmed })
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed')
        return res.json()
      })
      .then(({ response }) => onUpdate(response))
      .catch(err => console.error('Update failed:', err))
  }

  return (
    <article
      className={`bg-white p-6 rounded-xs shadow-sharp mb-6 border font-eixample ${
        isNew ? 'animate-fade-in' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="text-gray-800 mb-4 flex-1 break-words whitespace-normal">
          {message}
        </p>
        {isOwner && (
          <div className="space-x-2">
            <button
              onClick={handleEdit}
              aria-label="Edit thought"
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete thought"
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            disabled={isLiked}
            aria-label={
              isLiked
                ? `You have liked this thought (${hearts} likes)`
                : `Like this thought (${hearts} likes)`
            }
            aria-pressed={isLiked}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              isLiked
                ? 'bg-pink-200 cursor-default'
                : 'bg-gray-200 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            ❤️
          </button>
          <span>x {hearts}</span>
        </div>
        <span>{dayjs(createdAt).fromNow()}</span>
      </div>
    </article>
  )
}