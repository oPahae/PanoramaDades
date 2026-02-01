import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, X, Search, Filter, ChevronLeft, ChevronRight, XCircle, CheckCircle, Calendar, DollarSign, Percent, AlertCircle, User, Building2, Download } from 'lucide-react';
import Select from 'react-select';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModal, setCancelModal] = useState({ show: false, reservationId: null, reservationCode: '' });
  const [editModal, setEditModal] = useState({ show: false, reservation: null });
  const [addModal, setAddModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [nbrNights, setNbrNights] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    customerID: '',
    roomID: '',
    checkIn: '',
    checkOut: '',
    amount: '',
    discount: 0,
    tva: 0
  });

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    const nights = calculateNights() > 0 ? calculateNights() : 1;
    setNbrNights(nights);

    if (formData.roomID) {
      const selectedRoom = rooms.find(r => r.id === Number(formData.roomID));
      if (selectedRoom) {
        setFormData(prev => ({
          ...prev,
          amount: selectedRoom.priceUSD * nights
        }));
      }
    }
  }, [formData.checkIn, formData.checkOut]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [reservations, statusFilter, searchQuery, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addModal && addModalRef.current && !addModalRef.current.contains(event.target)) {
        setAddModal(false);
        resetForm();
      }
      if (editModal.show && editModalRef.current && !editModalRef.current.contains(event.target)) {
        setEditModal({ show: false, reservation: null });
        resetForm();
      }
      if (cancelModal.show && cancelModalRef.current && !cancelModalRef.current.contains(event.target)) {
        setCancelModal({ show: false, reservationId: null, reservationCode: '' });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addModal, editModal, cancelModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resResponse, custResponse, roomsResponse] = await Promise.all([
        fetch('/api/reservations/getAll'),
        fetch('/api/customers/getAll'),
        fetch('/api/rooms/getAll')
      ]);

      if (!resResponse.ok || !custResponse.ok || !roomsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [resData, custData, roomsData] = await Promise.all([
        resResponse.json(),
        custResponse.json(),
        roomsResponse.json()
      ]);

      setReservations(resData);
      setCustomers(custData);
      setRooms(roomsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(res =>
        res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.roomTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.id.toString().includes(searchQuery)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dateCreation);
      const dateB = new Date(b.dateCreation);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredReservations(filtered);
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      const response = await fetch('/api/excel/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations: filteredReservations }),
      });

      if (!response.ok) throw new Error('Failed to generate Excel file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-${new Date().toISOString().split('T')[0]}.xlsx`;
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

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      const response = await fetch('/api/reservations/cancel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cancelModal.reservationId }),
      });

      if (!response.ok) throw new Error('Failed to cancel reservation');

      await fetchData();
      setCancelModal({ show: false, reservationId: null, reservationCode: '' });
    } catch (err) {
      alert('Error canceling reservation: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = async (reservationId) => {
    if (!confirm('Confirm checkout for this reservation?')) return;

    try {
      setProcessing(true);
      const response = await fetch('/api/reservations/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reservationId }),
      });

      if (!response.ok) throw new Error('Failed to checkout reservation');

      await fetchData();
    } catch (err) {
      alert('Error during checkout: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerID || !formData.roomID || !formData.checkIn || !formData.checkOut || !formData.amount) {
      alert('Please fill all required fields');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    try {
      setSaving(true);
      const url = editModal.show ? '/api/reservations/update' : '/api/reservations/add';
      const method = editModal.show ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal.show ? { ...formData, id: editModal.reservation.id } : formData),
      });

      const data = await response.json();
      if(response.status === 400) throw new Error(data.message);
      if (!response.ok) throw new Error('Failed to save reservation');
      
      await fetchData();
      setAddModal(false);
      setEditModal({ show: false, reservation: null });
      resetForm();
    } catch (err) {
      alert('Error saving reservation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerID: '',
      roomID: '',
      checkIn: '',
      checkOut: '',
      amount: '',
      discount: 0,
      tva: 0
    });
  };

  const openEditModal = (reservation) => {
    setFormData({
      customerID: reservation.customerID,
      roomID: reservation.roomID,
      checkIn: reservation.checkIn.split('T')[0],
      checkOut: reservation.checkOut.split('T')[0],
      amount: reservation.amount,
      discount: reservation.discount || 0,
      tva: reservation.tva || 0
    });
    setEditModal({ show: true, reservation });
  };

  const openAddModal = () => {
    resetForm();
    setAddModal(true);
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const tva = parseFloat(formData.tva) || 0;

    const afterDiscount = amount - (amount * discount / 100);
    const total = afterDiscount + (afterDiscount * tva / 100);

    return total.toFixed(2);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'finished':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getRowStyle = (status) => {
    switch (status) {
      case 'finished':
        return 'bg-green-50/30 hover:bg-green-50/50';
      case 'canceled':
        return 'opacity-50 line-through hover:bg-gray-50/50';
      default:
        return 'hover:bg-amber-50/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    return type === 'agency' ? Building2 : User;
  };

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: `${c.name} (${c.type})`
  }));

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
                Reservations
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
                <span>Add Reservation</span>
              </span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total', value: reservations.length, color: 'amber' },
              { label: 'Confirmed', value: reservations.filter(r => r.status === 'confirmed').length, color: 'blue' },
              { label: 'Paid', value: reservations.filter(r => r.status === 'paid').length, color: 'purple' },
              { label: 'Finished', value: reservations.filter(r => r.status === 'finished').length, color: 'green' },
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
                  placeholder="Search by customer, room or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="finished">Finished</option>
                  <option value="canceled">Canceled</option>
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

      {/* Reservations Table */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
                <p className="text-stone-600 font-light">Loading reservations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <p className="text-rose-900 text-lg font-medium">{error}</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg font-light">No reservations found</p>
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
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Room
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {currentReservations.map((reservation) => {
                        const TypeIcon = getTypeIcon(reservation.customerType);
                        return (
                          <tr
                            key={reservation.id}
                            className={`transition-colors duration-150 ${getRowStyle(reservation.status)}`}
                          >
                            <td className="px-6 py-4">
                              <div className="text-sm font-mono font-semibold text-stone-900">
                                #{reservation.id}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-stone-900 flex gap-2">
                                <TypeIcon className={`w-5 h-5 ${reservation.customerType === 'agency' ? 'text-blue-600' : 'text-green-600'}`} />
                                {reservation.customerName}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-stone-700">
                                {reservation.roomTitle}
                              </div>
                              <div className="text-xs text-stone-500">
                                Room #{reservation.roomID}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-700 whitespace-nowrap">
                              {formatDate(reservation.checkIn)}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-700 whitespace-nowrap">
                              {formatDate(reservation.checkOut)}
                            </td>
                            <td className="px-6 py-4">
                              {(reservation.discount > 0 || reservation.tva > 0) ? (
                                <>
                                  <div className="text-sm font-semibold text-stone-900">
                                    {(parseFloat(reservation.amount) * (1 - reservation.discount / 100) * (1 + reservation.tva / 100)).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-stone-500 line-through">
                                    ${parseFloat(reservation.amount).toFixed(2)}
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm font-semibold text-stone-900">
                                  ${parseFloat(reservation.amount).toFixed(2)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(reservation.status)}`}>
                                {reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center space-x-2">
                                {reservation.status !== 'canceled' && reservation.status !== 'finished' && (
                                  <button
                                    onClick={() => openEditModal(reservation)}
                                    className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                                {reservation.status === 'paid' && (
                                  <button
                                    onClick={() => handleCheckout(reservation.id)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                    title="Checkout"
                                    disabled={processing}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {reservation.status !== 'canceled' && reservation.status !== 'finished' && (
                                  <button
                                    onClick={() => setCancelModal({ show: true, reservationId: reservation.id, reservationCode: `#${reservation.id}` })}
                                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors duration-200"
                                    title="Cancel"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
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
                    <span className="font-semibold text-stone-900">{Math.min(endIndex, filteredReservations.length)}</span> of{' '}
                    <span className="font-semibold text-stone-900">{filteredReservations.length}</span> reservations
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
                  {editModal.show ? 'Edit Reservation' : 'Add New Reservation'}
                </h3>
                <button
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ show: false, reservation: null });
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
              {/* Customer & Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Customer <span className="text-rose-600">*</span>
                  </label>
                  <Select
                    options={customerOptions}
                    value={customerOptions.find(o => o.value === Number(formData.customerID)) || null}
                    onChange={(option) =>
                      setFormData({ ...formData, customerID: option.value })
                    }
                    placeholder="Search customer..."
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  >
                    <option value="">S Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.type})
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Room <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.roomID}
                    onChange={(e) => {
                      const selectedRoom = rooms.find(room => room?.id === Number(e.target.value));
                      setFormData({ ...formData, roomID: selectedRoom?.id, amount: selectedRoom?.priceUSD * nbrNights });
                    }}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.filter(room => room.status === 'available').map(room => (
                      <option key={room.id} value={room.id}>
                        {room.title} - ${room.priceUSD}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Check-in & Check-out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Check-in <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Check-out <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    min={formData.checkIn}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Nights Display */}
              {formData.checkIn && formData.checkOut && calculateNights() > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {calculateNights()} Night{calculateNights() !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Amount, Discount, TVA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Amount <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    TVA (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.tva}
                      onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Total Display */}
              {formData.amount && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-900 uppercase tracking-wider">
                      Total TTC
                    </span>
                    <span className="text-3xl font-serif font-bold text-amber-900">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal({ show: false, reservation: null });
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
                    <span>{editModal.show ? 'Update Reservation' : 'Add Reservation'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={cancelModalRef}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Cancel Reservation</h3>
                </div>
                <button
                  onClick={() => setCancelModal({ show: false, reservationId: null, reservationCode: '' })}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={processing}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <p className="text-stone-600 leading-relaxed">
                Are you sure you want to cancel reservation <span className="font-semibold text-stone-900">{cancelModal.reservationCode}</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCancelModal({ show: false, reservationId: null, reservationCode: '' })}
                  disabled={processing}
                  className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-lg font-medium tracking-wider uppercase hover:from-rose-700 hover:to-rose-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Canceling...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Yes, Cancel</span>
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
