import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import LeadTable from './components/LeadTable';
import LeadModal from './components/LeadModal';
import DeleteModal from './components/DeleteModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

function LeadManagerDashboard() {
  const { user } = useAuth();

  // State
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch metrics statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.leads.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err.message);
    }
  }, []);

  // Fetch leads with active filters
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.leads.getAll({
        search,
        status: statusFilter,
        source: sourceFilter,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res.success && res.data) {
        setLeads(res.data.leads || []);
        setPagination((prev) => ({
          ...prev,
          ...res.data.pagination,
        }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, sortBy, sortOrder, pagination.page, pagination.limit]);

  // Trigger initial fetch and reload on dependency changes
  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [fetchLeads, fetchStats, user]);

  // Handlers
  const handleSearchChange = (val) => {
    setSearch(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSourceFilterChange = (source) => {
    setSourceFilter(source);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setSourceFilter('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleOpenAddModal = () => {
    setLeadToEdit(null);
    setIsLeadModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setLeadToEdit(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLead = async (formData) => {
    if (leadToEdit) {
      await api.leads.update(leadToEdit.id, formData);
      showToast('Lead updated successfully!');
    } else {
      await api.leads.create(formData);
      showToast('New lead captured successfully!');
    }
    fetchLeads();
    fetchStats();
  };

  const handleDeleteLeadConfirm = async (leadId) => {
    await api.leads.delete(leadId);
    showToast('Lead deleted successfully.', 'info');
    fetchLeads();
    fetchStats();
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      await api.leads.update(leadId, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      fetchLeads();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome & Context Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Lead Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track prospects, manage qualifications, and accelerate deal closures.
            </p>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <StatsCards
          stats={stats}
          selectedStatus={statusFilter}
          onSelectStatus={handleStatusFilterChange}
        />

        {/* Search, Filter, and Sort Controls */}
        <SearchBar
          search={search}
          onSearchChange={handleSearchChange}
          status={statusFilter}
          onStatusChange={handleStatusFilterChange}
          source={sourceFilter}
          onSourceChange={handleSourceFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
        />

        {/* Leads Table */}
        <LeadTable
          leads={leads}
          loading={loading}
          pagination={pagination}
          onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
          onEditLead={handleOpenEditModal}
          onDeleteLead={handleOpenDeleteModal}
          onStatusChange={handleQuickStatusChange}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Lead Manager Assignment • Built with React, Express, Prisma & SQLite
        </div>
      </footer>

      {/* Add / Edit Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        leadToEdit={leadToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteLeadConfirm}
        lead={leadToDelete}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast('Signed in successfully!');
          fetchLeads();
          fetchStats();
        }}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LeadManagerDashboard />
    </AuthProvider>
  );
}
