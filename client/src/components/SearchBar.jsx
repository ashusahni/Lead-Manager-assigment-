import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS = ['All', 'Website', 'Referral', 'LinkedIn', 'Cold Outreach', 'Event', 'Other'];
const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Oldest First', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'Name (A-Z)', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Name (Z-A)', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Company (A-Z)', sortBy: 'company', sortOrder: 'asc' },
  { label: 'Status', sortBy: 'status', sortOrder: 'asc' },
];

export default function SearchBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || source !== 'All';

  const currentSortKey = `${sortBy}_${sortOrder}`;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-colors text-slate-900 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Status:</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer pr-1"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <span className="font-medium text-slate-500">Source:</span>
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer pr-1"
            >
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Sort:</span>
            <select
              value={currentSortKey}
              onChange={(e) => {
                const found = SORT_OPTIONS.find((s) => `${s.sortBy}_${s.sortOrder}` === e.target.value);
                if (found) {
                  onSortChange(found.sortBy, found.sortOrder);
                }
              }}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer pr-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={`${opt.sortBy}_${opt.sortOrder}`} value={`${opt.sortBy}_${opt.sortOrder}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
