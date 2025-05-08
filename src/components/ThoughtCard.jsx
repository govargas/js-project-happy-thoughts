import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const ThoughtCard = ({ id, message, hearts, createdAt, onLike, isLiked }) => {
  return (
    <article className="…">
      <p>{message}</p>
      <div className="flex …">
        <button
          onClick={() => onLike(id)}
          disabled={isLiked}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full
            ${isLiked ? 'bg-pink-200 cursor-default' : 'bg-gray-200'}
          `}
        >
          ❤️
        </button>
        <span>x {hearts}</span>
        <span>{dayjs(createdAt).fromNow()}</span>
      </div>
    </article>
  )
}

export default ThoughtCard