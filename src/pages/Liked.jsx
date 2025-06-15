import React from 'react'
import ThoughtCard from '../components/ThoughtCard.jsx'

export default function Liked({ thoughts, likedIds, handleLike, handleDelete, handleUpdate, lastAddedId }) {
  // filter only those thoughts the user has liked
  const likedThoughts = thoughts.filter(t => likedIds.includes(t._id))

  if (likedThoughts.length === 0) {
    return <p className="text-center">You haven’t liked any thoughts yet.</p>
  }

  return likedThoughts.map(th => (
    <ThoughtCard
      key={th._id}
      {...th}
      onLike={handleLike}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      isLiked
      isNew={th._id === lastAddedId}
    />
  ))
}