import React from 'react';
import { Mail, Phone, Building2, Pencil, Trash2, ChevronLeft, ChevronRight, Inbox, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  New: {
    label: 'New',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Contacted: {
    label: 'Contacted',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Qualified: {
    label: 'Qualified',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Lost: {
    label: 'Lost',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};

const STATUS_LIST = ['New', 'Contacted', 'Qualified', 'Lost'];

export default function LeadTable({
  leads,
  loading,
  pagination,
  onPageChange,
  onEditLead,
  onDeleteLead,
  onStatusChange,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading leads...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No leads found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No leads match your current search and filter criteria, or no leads have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Lead Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.map((lead) => {
              const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.New;
              const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Lead Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{lead.name}</div>
                    {lead.notes && (
                      <p className="text-xs text-slate-400 truncate max-w-xs" title={lead.notes}>
                        {lead.notes}
                      </p>
                    )}
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">{lead.company}</span>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col space-y-0.5">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center space-x-1 text-xs text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{lead.email}</span>
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {lead.source}
                    </span>
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center">
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-colors ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        {STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={() => onEditLead(lead)}
                        title="Edit lead"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteLead(lead)}
                        title="Delete lead"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="py-3 px-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium text-slate-800">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium text-slate-800">{pagination.total}</span> leads
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
