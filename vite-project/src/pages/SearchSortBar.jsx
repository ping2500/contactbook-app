// vite-project/src/components/SearchSortBar.jsx
import React from 'react';

/* CHANGE: New component to handle search + sort inputs - accessible */
export default function SearchSortBar({
  search,
  onSearchChange,
  sortBy,
  order,
  onSortChange,
  onOrderChange,
  limit,
  onLimitChange
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-2">
      <label htmlFor="search" className="sr-only">Search contacts</label>
      <input
        id="search"
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search name, email or phone..."
        aria-label="Search contacts"
        className="w-full sm:w-80 px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <div className="flex gap-2 items-center">
        <label htmlFor="sortBy" className="sr-only">Sort by</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort contacts by"
          className="px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="created_at">Created</option>
        </select>

        <label htmlFor="order" className="sr-only">Sort order</label>
        <select
          id="order"
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
          aria-label="Sort order"
          className="px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <label htmlFor="limit" className="sr-only">Items per page</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          aria-label="Items per page"
          className="px-3 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
}
