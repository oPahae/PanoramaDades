import { useState, useEffect } from 'react';
import { 
  Users, 
  Bed, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Home as HomeIcon,
  ChevronDown,
  RefreshCw,
  Filter,
  X
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customerSort, setCustomerSort] = useState('reservations');

  useEffect(() => {
    fetchStats();
  }, [timeFilter]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let url = '/api/stats/getAll';
      
      const params = new URLSearchParams();
      if (timeFilter !== 'all' && timeFilter !== 'custom') {
        params.append('filter', timeFilter);
      }
      if (timeFilter === 'custom' && customRange.start && customRange.end) {
        params.append('startDate', customRange.start);
        params.append('endDate', customRange.end);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    if (value !== 'custom') {
      setShowCustomRange(false);
      setCustomRange({ start: '', end: '' });
    } else {
      setShowCustomRange(true);
    }
  };

  const applyCustomRange = () => {
    if (customRange.start && customRange.end) {
      fetchStats();
    }
  };

  const clearCustomRange = () => {
    setCustomRange({ start: '', end: '' });
    setTimeFilter('all');
    setShowCustomRange(false);
  };

  // Colors
  const ROOM_COLORS = {
    available: '#10b981',
    occupied: '#f59e0b',
    maintenance: '#ef4444'
  };

  const RESERVATION_COLORS = {
    confirmed: '#3b82f6',
    canceled: '#ef4444',
    paid: '#10b981',
    finished: '#6b7280'
  };

  const INVOICE_COLORS = {
    pending: '#f59e0b',
    paid: '#10b981',
    canceled: '#ef4444'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
          <p className="text-stone-600 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center max-w-md">
          <p className="text-rose-900 text-lg font-medium">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-900 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const topCustomersByReservations = [...(stats?.customers?.details || [])]
    .sort((a, b) => b.totalReservations - a.totalReservations)
    .slice(0, 5);

  const topCustomersByPayment = [...(stats?.customers?.details || [])]
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 5);

  const displayedCustomers = customerSort === 'reservations' 
    ? topCustomersByReservations 
    : topCustomersByPayment;

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:mr-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-6 mb-12">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Dashboard
              </div>
              <div className="w-16 h-px bg-amber-900" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Analytics
                <br />
                <span className="italic text-amber-900">Overview</span>
              </h1>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Time Filter */}
                <div className="flex-1">
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <select
                      value={timeFilter}
                      onChange={(e) => handleTimeFilterChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                    >
                      <option value="all">All Time</option>
                      <option value="day">Last 24 Hours</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="year">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>

                {/* Custom Range */}
                {showCustomRange && (
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    />
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={applyCustomRange}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-900 transition-all"
                    >
                      Apply
                    </button>
                    <button
                      onClick={clearCustomRange}
                      className="px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Refresh Button */}
                <button
                  onClick={fetchStats}
                  className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Customers
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-blue-900">
                {stats?.overview?.totalCustomers || 0}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Bed className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Rooms
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-purple-900">
                {stats?.overview?.totalRooms || 0}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Occupancy
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-amber-900">
                {stats?.overview?.occupancyRate || 0}%
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Reservations
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-green-900">
                {stats?.overview?.totalReservations || 0}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Total Revenue
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900">
                ${stats?.overview?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-teal-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Paid
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-teal-900">
                ${stats?.overview?.totalPaid?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-rose-700" />
                </div>
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Pending
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-900">
                ${stats?.overview?.totalPending?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="relative pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
              Rooms <span className="italic text-amber-900">Analytics</span>
            </h2>
            <div className="w-16 h-px bg-amber-900" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Room Status Distribution */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4 sm:p-8">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Room Status</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.rooms?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(stats?.rooms?.statusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ROOM_COLORS[entry.name.toLowerCase()]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reservations & Revenue by Room */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4 sm:p-8">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Reservations & Revenue by Room</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.rooms?.byRoom || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="roomTitle" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="reservations" fill="#3b82f6" name="Reservations" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Section */}
      <section className="relative pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
              Financial <span className="italic text-amber-900">Overview</span>
            </h2>
            <div className="w-16 h-px bg-amber-900" />
          </div>

          {/* Invoice Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50 shadow-lg">
              <div className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">
                Paid Invoices
              </div>
              <div className="text-3xl font-serif font-bold text-green-900">
                ${stats?.financial?.invoicesPaid?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                Pending Invoices
              </div>
              <div className="text-3xl font-serif font-bold text-amber-900">
                ${stats?.financial?.invoicesPending?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-6 border border-rose-200/50 shadow-lg">
              <div className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-2">
                Canceled Invoices
              </div>
              <div className="text-3xl font-serif font-bold text-rose-900">
                ${stats?.financial?.invoicesCanceled?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">
                Payment Rate
              </div>
              <div className="text-3xl font-serif font-bold text-blue-900">
                {stats?.financial?.paymentRate || 0}%
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Revenue Over Time */}
            <div className="lg:col-span-2 xl:col-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4 sm:p-8">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Revenue Over Time</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.financial?.revenueOverTime || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Revenue ($)"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reservations by Status */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4 sm:p-8">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Reservations by Status</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.financial?.reservationsByStatus || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(stats?.financial?.reservationsByStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RESERVATION_COLORS[entry.name.toLowerCase()]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Invoices by Status */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 p-4 sm:p-8">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Invoices by Status</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.financial?.invoicesByStatus || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(stats?.financial?.invoicesByStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={INVOICE_COLORS[entry.name.toLowerCase()]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section className="relative pb-32 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
                Top <span className="italic text-amber-900">Customers</span>
              </h2>
              <div className="w-16 h-px bg-amber-900" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
                Sort by:
              </span>
              <select
                value={customerSort}
                onChange={(e) => setCustomerSort(e.target.value)}
                className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors bg-white"
              >
                <option value="reservations">Reservations</option>
                <option value="payment">Payment</option>
              </select>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b-2 border-amber-200">
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Reservations
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Total Pending
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {displayedCustomers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 font-bold text-amber-900">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-stone-900">
                          {customer.name}
                        </div>
                        <div className="text-xs text-stone-500">
                          ID: #{customer.id}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.type === 'individual' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {customer.type}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-stone-900">
                          {customer.totalReservations}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-green-900">
                          ${customer.totalPaid.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-amber-900">
                          ${customer.totalPending.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {displayedCustomers.length === 0 && (
              <div className="p-12 text-center text-stone-500">
                No customer data available
              </div>
            )}
          </div>
        </div>
      </section>
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