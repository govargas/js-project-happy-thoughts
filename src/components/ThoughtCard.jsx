import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const ThoughtCard = ({ id, message, hearts, createdAt, onLike, isLiked, isNew }) => {
  // Perform POST here, then hand result back up
  const handleClick = () => {
    if (isLiked) return

    fetch(`https://happy-thoughts-api-4ful.onrender.com/thoughts/${id}/like`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not register like')
        return res.json()
      })
      .then((updatedThought) => {
        onLike(updatedThought)  // passes updated object to App
      })
      .catch((err) => console.error('Like failed:', err))
  }

  return (
    <article
      className={`bg-white p-6 rounded-xs shadow-sharp mb-6 border font-eixample ${
        isNew ? 'animate-fade-in' : ''
      }`}
    >
      <p className="text-gray-800 mb-4 break-words whitespace-normal">{message}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClick}
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

export default ThoughtCard