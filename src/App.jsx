import React, { useState, useEffect } from 'react'
import Form from './components/Form.jsx'
import ThoughtCard from './components/ThoughtCard.jsx'

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastAddedId, setLastAddedId] = useState(null)
  const [likedIds, setLikedIds] = useState(() =>
    JSON.parse(localStorage.getItem('happy-likes') || '[]')
  )

  // Fetch on mount
  useEffect(() => {
    fetch('https://happy-thoughts-api-4ful.onrender.com/thoughts')
      .then(res => res.json())
      .then(data => {
        setThoughts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Add new thought & trigger entry animation
  const addThought = (newThought) => {
    setThoughts([newThought, ...thoughts])
    setLastAddedId(newThought._id)
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
          />
        ))}
    </main>
  )
}

export default App