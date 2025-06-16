import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router'
import Form from './components/Form.jsx'
import ThoughtCard from './components/ThoughtCard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Liked from './pages/Liked.jsx'

const API_URL = import.meta.env.VITE_API_URL

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastAddedId, setLastAddedId] = useState(null)

  // start with whatever's in localStorage
  const [likedIds, setLikedIds] = useState(() =>
    JSON.parse(localStorage.getItem('happy-likes') || '[]')
  )

  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})
  const [minHearts, setMinHearts] = useState('')
  const [sortParam, setSortParam] = useState('createdAt_desc')

  const token = localStorage.getItem('token')

  // 0) Whenever we get a token (login or refresh), fetch /auth/me for likedIds
  useEffect(() => {
    if (!token) return

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data')
        return res.json()
      })
      .then(json => {
        // assume backend responds { success: true, response: { likedIds: [...] } }
        const serverLiked = json.response?.likedIds ?? []
        setLikedIds(serverLiked)
        localStorage.setItem('happy-likes', JSON.stringify(serverLiked))
      })
      .catch(err => {
        console.error('Could not load likedIds from server:', err)
      })
  }, [token])

  // 1) Fetch thoughts (with pagination, filtering, sorting)
  useEffect(() => {
    setLoading(true)
    let url = `${API_URL}/thoughts?page=${page}&limit=20`
    if (minHearts) url += `&minHearts=${minHearts}`
    if (sortParam) {
      const [field, dir] = sortParam.split('_')
      url += `&sortBy=${field}&order=${dir}`
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const items = data.response ?? data.thoughts ?? []
        const newMeta = data.meta ?? {}
        setMeta(newMeta)
        setThoughts(prev => (page === 1 ? items : [...prev, ...items]))
      })
      .catch(err => console.error('Failed to load thoughts:', err))
      .finally(() => setLoading(false))
  }, [page, minHearts, sortParam])

  // 2) Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading || page >= meta.totalPages) return
      const bottomReached =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100
      if (bottomReached) setPage(prev => prev + 1)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, page, meta.totalPages])

  // 3) Create a new thought
  const addThought = newThought => {
    setThoughts(prev => [newThought, ...prev])
    setLastAddedId(newThought._id)
    setPage(1)
  }

  // 4) Like handler
  const handleLike = updatedThought => {
    const id = updatedThought._id
    // update that one thought
    setThoughts(prev => prev.map(t => (t._id === id ? updatedThought : t)))
    // also record it locally
    if (!likedIds.includes(id)) {
      const next = [...likedIds, id]
      setLikedIds(next)
      localStorage.setItem('happy-likes', JSON.stringify(next))
    }
  }

  // 5) Delete handler
  const handleDelete = id => {
    fetch(`${API_URL}/thoughts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed')
        setThoughts(prev => prev.filter(t => t._id !== id))
        const nextLikes = likedIds.filter(l => l !== id)
        setLikedIds(nextLikes)
        localStorage.setItem('happy-likes', JSON.stringify(nextLikes))
      })
      .catch(console.error)
  }

  // 6) Update handler
  const handleUpdate = updated => {
    setThoughts(prev => prev.map(t => (t._id === updated._id ? updated : t)))
  }

  // The main feed view
  const Feed = () => (
    <main className="max-w-lg w-full mx-auto p-4">
      {loading && <p className="text-center">Loading thoughts…</p>}

      <Form onSubmitThought={addThought} />

      {/* Filters */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="min-hearts" className="font-ivymode">Min likes:</label>
        <input
          id="min-hearts"
          type="number"
          min="0"
          value={minHearts}
          onChange={e => {
            setMinHearts(e.target.value)
            setPage(1)
          }}
          placeholder="0"
          className="border p-1 rounded text-sm"
        />
      </div>
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="sort-by" className="font-ivymode">Sort by:</label>
        <select
          id="sort-by"
          value={sortParam}
          onChange={e => {
            setSortParam(e.target.value)
            setPage(1)
          }}
          className="border p-1 rounded text-sm"
        >
          <option value="createdAt_desc">Newest first</option>
          <option value="hearts_desc">Most liked first</option>
        </select>
      </div>

      {/* Thought list */}
      {!loading &&
        thoughts.map(th => (
          <ThoughtCard
            key={th._id}
            id={th._id}
            message={th.message}
            hearts={th.hearts}
            createdAt={th.createdAt}
            onLike={handleLike}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            isLiked={likedIds.includes(th._id)}
            isNew={th._id === lastAddedId}
          />
        ))}
    </main>
  )

  return (
    <>
      <nav className="flex justify-between mb-6 p-4 bg-gray-100 border-b">
        <Link to="/" className="font-ivymode">Home</Link>
        <div className="space-x-4">
          <Link to="/liked" className="font-ivymode">My Likes</Link>
          {token ? (
            <button
              onClick={() => {
                localStorage.removeItem('token')
                window.location.reload()
              }}
              className="font-ivymode"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="font-ivymode">Login</Link>
              <Link to="/register" className="font-ivymode">Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/liked"
          element={
            <Liked
              thoughts={thoughts}
              likedIds={likedIds}
              handleLike={handleLike}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              lastAddedId={lastAddedId}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App