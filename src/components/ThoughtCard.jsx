import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ThoughtCard = ({
  id,
  message,
  hearts,
  createdAt,
  onLike,
  onDelete,
  onUpdate,
  isLiked,
  isNew
}) => {
  const handleClick = () => {
    if (isLiked) return;
    onLike(id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this thought?')) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    const newMsg = window.prompt('Edit your thought:', message);
    if (newMsg != null) {
      const trimmed = newMsg.trim();
      if (trimmed.length >= 5 && trimmed.length <= 140) {
        onUpdate(id, trimmed);
      } else {
        window.alert('Thought must be between 5 and 140 characters.');
      }
    }
  };

  return (
    <article className={`bg-white p-6 rounded-xs shadow-sharp mb-6 border font-eixample ${isNew ? 'animate-fade-in' : ''}`}>
      <div className="flex justify-between items-start">
        <p className="text-gray-800 mb-4 break-words whitespace-normal flex-1">
          {message}
        </p>
        <div className="space-x-2">
          <button onClick={handleEdit} aria-label="Edit thought" className="text-blue-600 hover:underline text-sm">
            Edit
          </button>
          <button onClick={handleDelete} aria-label="Delete thought" className="text-red-600 hover:underline text-sm">
            Delete
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
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
  );
};

export default ThoughtCard;