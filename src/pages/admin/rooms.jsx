import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Bed, Users, Eye, DollarSign, AlertCircle, Check, X } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, roomId: null, roomTitle: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms/getAll');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch('/api/rooms/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteModal.roomId }),
      });

      if (!response.ok) throw new Error('Failed to delete room');

      // Refresh rooms list
      await fetchRooms();
      setDeleteModal({ show: false, roomId: null, roomTitle: '' });
    } catch (err) {
      alert('Error deleting room: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
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
      <section className="relative pt-28 pb-16 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-12">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Administration
              </div>
              <div className="w-16 h-px bg-amber-900" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
                Rooms
                <br />
                <span className="italic text-amber-900">Management</span>
              </h1>
            </div>

            <Link
              href="/admin/addRoom"
              className="group relative px-8 py-5 overflow-hidden rounded font-medium tracking-wider uppercase"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-white flex items-center space-x-3">
                <Plus className="w-5 h-5" />
                <span>Add New Room</span>
              </span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Rooms', value: rooms.length, color: 'amber' },
              { label: 'Available', value: rooms.filter(r => r.status === 'available').length, color: 'emerald' },
              { label: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: 'orange' },
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
        </div>
      </section>

      {/* Rooms List */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
                <p className="text-stone-600 font-light">Loading rooms...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <p className="text-rose-900 text-lg font-medium">{error}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-2xl p-12 text-center">
              <Bed className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg font-light">No rooms found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="group bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Room Image */}
                    <div className="lg:col-span-3">
                      <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
                        <img
                          src={room.image || '/placeholder-room.jpg'}
                          alt={room.title}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(room.status)}`}>
                            {room.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="lg:col-span-6 p-6 lg:p-8">
                      <div className="space-y-4">
                        {/* Title & Category */}
                        <div>
                          <h3 className="text-3xl font-serif font-bold text-stone-900 mb-2">
                            {room.title}
                          </h3>
                          <p className="text-sm text-stone-600 uppercase tracking-wider">
                            {room.category}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-stone-600 leading-relaxed font-light line-clamp-2">
                          {room.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center space-x-2 text-stone-700">
                            <Bed className="w-5 h-5 text-amber-900" />
                            <span className="text-sm font-medium">{room.beds} Bed{room.beds > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-stone-700">
                            <Users className="w-5 h-5 text-amber-900" />
                            <span className="text-sm font-medium">{room.guests} Guest{room.guests > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-stone-700">
                            <Eye className="w-5 h-5 text-amber-900" />
                            <span className="text-sm font-medium">{room.view}</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center space-x-6 pt-4 border-t border-stone-200">
                          <div>
                            <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">USD Price</div>
                            <div className="text-2xl font-serif font-bold text-amber-900">
                              ${room.priceUSD}
                            </div>
                          </div>
                          <div className="h-12 w-px bg-stone-200" />
                          <div>
                            <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">CHF Price</div>
                            <div className="text-2xl font-serif font-bold text-amber-900">
                              {room.priceCHF} CHF
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 p-6 lg:p-8 bg-stone-50/50 flex flex-col justify-center space-y-4">
                      <Link
                        href={`/admin/updateRoom?id=${room.id}`}
                        className="group/btn flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-amber-900 text-amber-900 rounded-lg font-medium tracking-wider uppercase hover:bg-amber-900 hover:text-white transition-all duration-300"
                      >
                        <Edit className="w-5 h-5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => setDeleteModal({ show: true, roomId: room.id, roomTitle: room.title })}
                        className="group/btn flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-rose-600 text-rose-600 rounded-lg font-medium tracking-wider uppercase hover:bg-rose-600 hover:text-white transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                      </button>

                      <div className="pt-4 border-t border-stone-200">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Room ID</div>
                        <div className="text-sm font-mono font-medium text-stone-700">#{room.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in">
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
                  onClick={() => setDeleteModal({ show: false, roomId: null, roomTitle: '' })}
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
                Are you sure you want to delete the room <span className="font-semibold text-stone-900">"{deleteModal.roomTitle}"</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, roomId: null, roomTitle: '' })}
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