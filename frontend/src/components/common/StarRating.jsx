import { FiStar } from 'react-icons/fi'

export default function StarRating({ rating, max = 5, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(i + 1) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <FiStar
            size={size}
            className={i < rating ? 'text-amber-400 fill-current' : 'text-slate-600'}
          />
        </button>
      ))}
    </div>
  )
}
