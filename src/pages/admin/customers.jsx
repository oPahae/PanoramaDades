import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, User, Building2, AlertCircle, X, Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, clientId: null, clientName: '' });
  const [editModal, setEditModal] = useState({ show: false, client: null });
  const [addModal, setAddModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    type: 'person',
    name: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    cin: '',
    passport: ''
  });

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [clients, typeFilter, searchQuery, sortOrder]);

  useEffect(() => {
  }, [typeFilter, searchQuery, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addModal && addModalRef.current && !addModalRef.current.contains(event.target)) {
        setAddModal(false);
        resetForm();
      }
      if (editModal.show && editModalRef.current && !editModalRef.current.contains(event.target)) {
        setEditModal({ show: false, client: null });
        resetForm();
      }
      if (deleteModal.show && deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
        setDeleteModal({ show: false, clientId: null, clientName: '' });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addModal, editModal, deleteModal]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers/getAll');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...clients];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dateCreation);
      const dateB = new Date(b.dateCreation);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredClients(filtered);
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      const response = await fetch('/api/excel/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: filteredClients }),
      });

      if (!response.ok) throw new Error('Failed to generate Excel file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error downloading Excel file: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch('/api/customers/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteModal.clientId }),
      });

      if (!response.ok) throw new Error('Failed to delete client');

      await fetchClients();
      setDeleteModal({ show: false, clientId: null, clientName: '' });
    } catch (err) {
      alert('Error deleting client: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      setSaving(true);
      const url = editModal.show ? '/api/customers/update' : '/api/customers/add';
      const method = editModal.show ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal.show ? { ...formData, id: editModal.client.id } : formData),
      });

      if (!response.ok) throw new Error('Failed to save client');

      await fetchClients();
      setAddModal(false);
      setEditModal({ show: false, client: null });
      resetForm();
    } catch (err) {
      alert('Error saving client: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'person',
      name: '',
      phone: '',
      email: '',
      address: '',
      country: '',
      cin: '',
      passport: ''
    });
  };

  const openEditModal = (client) => {
    setFormData({
      type: client.type,
      name: client.name,
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      country: client.country || '',
      cin: client.cin || '',
      passport: client.passport || ''
    });
    setEditModal({ show: true, client });
  };

  const openAddModal = () => {
    resetForm();
    setAddModal(true);
  };

  const getTypeIcon = (type) => {
    return type === 'agency' ? Building2 : User;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:mr-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-12">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Administration
              </div>
              <div className="w-16 h-px bg-amber-900" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Customers
                <br />
                <span className="italic text-amber-900">Management</span>
              </h1>
            </div>

            <button
              onClick={openAddModal}
              className="group relative px-8 py-5 overflow-hidden rounded font-medium tracking-wider uppercase"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-white flex items-center space-x-3">
                <Plus className="w-5 h-5" />
                <span>Add New Client</span>
              </span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Clients', value: clients.length, color: 'amber' },
              { label: 'Person', value: clients.filter(c => c.type === 'person').length, color: 'purple' },
              { label: 'Agency', value: clients.filter(c => c.type === 'agency').length, color: 'blue' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 shadow-lg">
                <div className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className={`text-4xl font-serif font-bold text-${stat.color}-900`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="person">Person</option>
                  <option value="agency">Agency</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Table */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
                <p className="text-stone-600 font-light">Loading clients...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <p className="text-rose-900 text-lg font-medium">{error}</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-2xl p-12 text-center">
              <User className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg font-light">No clients found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Download Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleDownloadExcel}
                  disabled={downloading}
                  className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 text-white flex items-center space-x-2">
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Excel</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Table Container */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b-2 border-amber-200">
                        <th className="px-16 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Phone & Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Country
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          CIN
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Passport
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Date Created
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {currentClients.map((client, index) => {
                        const TypeIcon = getTypeIcon(client.type);
                        return (
                          <tr
                            key={client.id}
                            className="hover:bg-amber-50/30 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div className='flex gap-2'>
                                <TypeIcon className={`w-5 h-5 ${client.type === 'agency' ? 'text-blue-600' : 'text-green-600'}`} />
                                <div className="text-sm font-semibold text-stone-900">{client.name}</div>
                              </div>
                              <div className="text-xs text-stone-500 font-mono">ID: #{client.id}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-700">
                              {client.phone || <span className="text-stone-400">—</span>}
                              <br />
                              {client.email || <span className="text-stone-400">—</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-700">
                              {client.country || <span className="text-stone-400">—</span>}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-stone-700">
                              {client.cin || <span className="text-stone-400">—</span>}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-stone-700">
                              {client.passport || <span className="text-stone-400">—</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                              {formatDate(client.dateCreation)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => openEditModal(client)}
                                  className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ show: true, clientId: client.id, clientName: client.name })}
                                  className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors duration-200"
                                  title="Delete"
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
              </div>

              {/* Pagination */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-stone-200/50 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* Results Info */}
                  <div className="text-sm text-stone-600 text-center md:text-left">
                    Showing <span className="font-semibold text-stone-900">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-stone-900">{Math.min(endIndex, filteredClients.length)}</span> of{' '}
                    <span className="font-semibold text-stone-900">{filteredClients.length}</span> clients
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">

                    {/* Items per page */}
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-sm"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>

                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border-2 border-stone-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-stone-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-stone-700" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === pageNumber
                                ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
                                : 'border-2 border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border-2 border-stone-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-stone-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {(addModal || editModal.show) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={addModal ? addModalRef : editModalRef}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in my-8 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-white">
                  {editModal.show ? 'Edit Client' : 'Add New Client'}
                </h3>
                <button
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ show: false, client: null });
                    resetForm();
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={saving}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Type <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  required
                >
                  <option value="person">Person</option>
                  <option value="agency">Agency</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value.startsWith('+')) value = '+' + value.slice(1).replace(/\D/g, '');
                      else value = value.replace(/\D/g, '');
                      setFormData({ ...formData, phone: value });
                    }}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                />
              </div>

              {/* CIN & Passport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={formData.cin}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Passport
                  </label>
                  <input
                    type="text"
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ show: false, client: null });
                    resetForm();
                  }}
                  disabled={saving}
                  className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium tracking-wider uppercase hover:from-amber-700 hover:to-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editModal.show ? 'Update Client' : 'Add Client'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Confirm Delete</h3>
                </div>
                <button
                  onClick={() => setDeleteModal({ show: false, clientId: null, clientName: '' })}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={deleting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <p className="text-stone-600 leading-relaxed">
                Are you sure you want to delete the client <span className="font-semibold text-stone-900">"{deleteModal.clientName}"</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, clientId: null, clientName: '' })}
                  disabled={deleting}
                  className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-lg font-medium tracking-wider uppercase hover:from-rose-700 hover:to-rose-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const root = verifyAuth(req, res);

  if (!root) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { connected: true } },
  };
}