import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null

  const start = Math.max(1, page - 2)
  const end = Math.min(pages, start + 4)
  const nums = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 border border-gray-200 rounded-full text-sm flex items-center justify-center
                   hover:bg-primary-light hover:shadow-sm transition-all disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-8 border rounded-full text-sm font-medium transition-all ${
            n === page
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'border-gray-200 hover:bg-primary-light hover:shadow-sm'
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="w-8 h-8 border border-gray-200 rounded-full text-sm flex items-center justify-center
                   hover:bg-primary-light hover:shadow-sm transition-all disabled:opacity-30"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
