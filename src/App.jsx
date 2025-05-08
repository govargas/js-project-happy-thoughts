import React, { useState, useEffect } from 'react'
import Form from './components/Form.jsx'
import ThoughtCard from './components/ThoughtCard.jsx'

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState(() =>
    JSON.parse(localStorage.getItem('happy-likes') || '[]')
  )

  useEffect(() => {
    fetch('https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts')
      .then(res => res.json())
      .then(data => {
        setThoughts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addThought = (newThought) => {
    setThoughts([newThought, ...thoughts])
  }

  const handleLike = (id) => {
    // prevent double-likes
    if (likedIds.includes(id)) return

    fetch(`https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${id}/like`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(updated => {
        // update hearts in state
        setThoughts(ts =>
          ts.map(t => (t._id === id ? updated : t))
        )
        // record that this user liked it
        setLikedIds(prev => {
          const next = [...prev, id]
          localStorage.setItem('happy-likes', JSON.stringify(next))
          return next
        })
      })
  }

  return (
    <main className="max-w-lg w-full mx-auto p-4">
      {loading && <p className="text-center">Loading thoughts…</p>}
      <Form onSubmitThought={addThought} />
      {!loading &&
        thoughts.map(th => (
          <ThoughtCard
            key={th._id}
            id={th._id}
            message={th.message}
            hearts={th.hearts}
            createdAt={th.createdAt}
            onLike={handleLike}
            isLiked={likedIds.includes(th._id)}
          />
        ))}
    </main>
  )
}