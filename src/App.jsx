import React, { useState, useEffect } from 'react';
import Form from './components/Form.jsx';
import ThoughtCard from './components/ThoughtCard.jsx'

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState(() =>
    // read once on mount; default to an empty array
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

    // in handleLike(id):
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
      <Form onSubmitThought={addThought} />

      {/* Render the list of thoughts, might move later to a "ThoughtsCard.jsx" or similar */}
      {thoughts.map((msg, i) => (
        <article
          key={i}
          className="
            bg-white
            p-6
            rounded-xs
            border
            shadow-sharp
            mb-6
            font-eixample
          "
        >
          <p className="text-gray-800 mb-4">{msg}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            {/* Placeholder heart + count */}
            <div className="flex items-center space-x-2">
              <span
                className="
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  bg-gray-200    /* unliked state */
                "
              >
                ❤️
              </span>
              <span>x 0</span>
            </div>
            {/* Timestamp */}
            <span>just now</span>
          </div>
        </article>
      ))}
    </main>
  );
};