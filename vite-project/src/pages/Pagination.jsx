// vite-project/src/components/Pagination.jsx
import React from 'react';

/* ✨ CHANGE: Classic numbered pagination component */
export default function Pagination({ page, totalPages, onPageChange }) {
  const maxButtons = 7;
  const pages = [];

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center space-x-2 my-4" role="navigation">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded-md shadow-sm border disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="Previous page"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-300">1</button>
          {start > 2 && <span className="px-2">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-300 ${p === page ? 'bg-indigo-600 text-white' : ''}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-300">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-md shadow-sm border disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
