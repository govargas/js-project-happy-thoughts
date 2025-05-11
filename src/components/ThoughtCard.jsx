import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const ThoughtCard = ({ id, message, hearts, createdAt, onLike, isLiked }) => {
  // Define the click handler so it can call the parent callback
  const handleClick = () => {
    onLike(id)
  }

  return (
    <article className="bg-white p-6 rounded-xs shadow-sharp mb-6 border font-eixample">
      <p className="text-gray-800 mb-4">{message}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClick}             // now defined above
            disabled={isLiked}                // uses the prop
            className={`
              w-8 h-8 flex items-center justify-center rounded-full
              ${isLiked
                ? 'bg-pink-200 cursor-default'   // liked state
                : 'bg-gray-200 hover:bg-gray-300 cursor-pointer' // unliked
              }
            `}
          >
            ❤️
          </button>
          <span>x {hearts}</span>
        </div>
        <span>{dayjs(createdAt).fromNow()}</span> {/* uses Day.js on createdAt */}
      </div>
    </article>
  )
}

export default ThoughtCard