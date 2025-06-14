import React, { useState, useEffect } from 'react'
import Form from './components/Form.jsx'
import ThoughtCard from './components/ThoughtCard.jsx'

const API_URL = import.meta.env.VITE_API_URL;

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastAddedId, setLastAddedId] = useState(null)
  const [likedIds, setLikedIds] = useState(() =>
    JSON.parse(localStorage.getItem('happy-likes') || '[]')
  )
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})

  // Fetch on mount and page change
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/thoughts?page=${page}&limit=20`)
      .then(res => res.json())
      .then(data => {
        const items = data.thoughts ?? data
        setMeta(data.meta ?? {})
        setThoughts(prev =>
          page === 1 ? items : [...prev, ...items]
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  // Add new thought & trigger entry animation
  const addThought = (newThought) => {
    setThoughts(prev => [newThought, ...prev])
    setLastAddedId(newThought._id)
    setPage(1)
  }

  // Receives the updated thought object from child
  const handleLike = (updatedThought) => {
    const id = updatedThought._id
    if (likedIds.includes(id)) return

    // Update heart count in state
    setThoughts((prev) =>
      prev.map((th) =>
        th._id === id ? updatedThought : th
      )
    )
    // Persist that the user liked this thought
    setLikedIds((prev) => {
      const next = [...prev, id]
      localStorage.setItem('happy-likes', JSON.stringify(next))
      return next
    })
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/thoughts/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        setThoughts((prev) => prev.filter((th) => th._id !== id));
        const nextLiked = likedIds.filter((lid) => lid !== id);
        setLikedIds(nextLiked);
        localStorage.setItem('happy-likes', JSON.stringify(nextLiked));
      })
      .catch(console.error);
  };

  const handleUpdate = (id, newMessage) => {
    fetch(`${API_URL}/thoughts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage })
    })
      .then((res) => res.json())
      .then((updated) => {
        setThoughts((prev) =>
          prev.map((th) => (th._id === id ? updated : th))
        );
      })
      .catch(console.error);
  };

  return (
    <main className="max-w-lg w-full mx-auto p-4">
      {loading && <p className="text-center">Loading thoughts…</p>}

      <Form onSubmitThought={addThought} />

      {!loading &&
        thoughts.map((th) => (
          <ThoughtCard
            key={th._id}
            id={th._id}
            message={th.message}
            hearts={th.hearts}
            createdAt={th.createdAt}
            onLike={handleLike} // now expects full object
            isLiked={likedIds.includes(th._id)}
            isNew={th._id === lastAddedId}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      {/* Load More button */}
      {meta.page < meta.totalPages && (
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
          className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {loading ? 'Loading…' : `Load page ${page + 1}`}
        </button>
      )}
    </main>
  )
}

export default App