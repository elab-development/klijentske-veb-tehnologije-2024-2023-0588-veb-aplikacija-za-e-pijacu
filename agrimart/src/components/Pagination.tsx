import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={`mt-8 flex items-center justify-center gap-2 ${
        className ?? ''
      }`}
      aria-label='Pagination'
    >
      <button
        type='button'
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className='inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-green-900 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-green-400'
      >
        <ChevronLeft className='w-4 h-4' />
        Prev
      </button>

      {pages.map((p) => {
        const isActive = p === page;
        return (
          <button
            key={p}
            type='button'
            onClick={() => onPageChange(p)}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 ${
              isActive ? 'bg-green-600 text-white' : 'bg-white text-green-900'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type='button'
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className='inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-green-900 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-green-400'
      >
        Next
        <ChevronRight className='w-4 h-4' />
      </button>
    </nav>
  );
}
