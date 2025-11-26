import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  X,
  Download,
  Share2,
  Filter,
  Search,
  Ticket,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const toast = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const r = await api.get('/bookings/me');
      setBookings(r.data.bookings || []);
    } catch (err) { 
      console.error(err);
      toast.show('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id) {
    setCancellingId(id);
    try {
      await api.delete(`/bookings/${id}`);
      toast.show('🎉 Booking cancelled successfully', 'success');
      load();
    } catch (e) { 
      toast.show(e.response?.data?.message || 'Cancellation failed', 'error');
    } finally {
      setCancellingId(null);
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.event?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'upcoming' && new Date(booking.event?.startDate) > new Date()) ||
                         (filter === 'past' && new Date(booking.event?.startDate) <= new Date()) ||
                         (filter === 'CANCELLED' && booking.status === 'CANCELLED');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status, startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    
    if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
    if (eventDate <= now) return 'bg-gray-100 text-gray-800';
    if (status === 'CONFIRMED') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusIcon = (status, startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    
    if (status === 'CANCELLED') return <XCircle className="w-4 h-4" />;
    if (eventDate <= now) return <CheckCircle className="w-4 h-4" />;
    if (status === 'CONFIRMED') return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancel = (startDate, status) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    return eventDate > now && status !== 'CANCELLED';
  };

  const filterOptions = [
    { key: 'all', label: 'All Bookings', count: bookings.length },
    { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.event?.startDate) > new Date()).length },
    { key: 'past', label: 'Past Events', count: bookings.filter(b => new Date(b.event?.startDate) <= new Date()).length },
    { key: 'CANCELLED', label: 'Cancelled', count: bookings.filter(b => b.status === 'CANCELLED').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-xl text-gray-600">
              Manage all your event reservations in one place
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="flex items-center space-x-2 bg-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filterOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${
                filter === option.key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setFilter(option.key)}
            >
              <p className="text-sm text-gray-600 mb-2">{option.label}</p>
              <p className="text-3xl font-bold text-gray-900">{option.count}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings by event name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {filteredBookings.length === 0 ? (
              <motion.div
                key="no-bookings"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-20 bg-white rounded-2xl shadow-lg"
              >
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filter !== 'all' ? 'No matching bookings' : 'No bookings yet'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filter !== 'all' 
                    ? "Try adjusting your search or filter criteria"
                    : "Start by exploring amazing events and make your first booking!"
                  }
                </p>
                {(searchTerm || filter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="bookings-list"
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Event Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status, booking.event?.startDate)}`}>
                              {getStatusIcon(booking.status, booking.event?.startDate)}
                              <span className="capitalize">
                                {booking.status === 'CANCELLED' ? 'Cancelled' : 
                                 new Date(booking.event?.startDate) <= new Date() ? 'Completed' : 
                                 'Confirmed'}
                              </span>
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              {booking.event?.category || 'General'}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {booking.event?.title || 'Untitled Event'}
                          </h3>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>{formatDate(booking.event?.startDate)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="capitalize">{booking.event?.locationType} • {booking.event?.location}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span>{booking.seats} seat{booking.seats !== 1 ? 's' : ''} booked</span>
                            </div>
                          </div>

                          {booking.event?.description && (
                            <p className="mt-3 text-gray-700 text-sm leading-relaxed line-clamp-2">
                              {booking.event.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3 lg:items-end">
                          

                          <div className="flex space-x-2">
                            {canCancel(booking.event?.startDate, booking.status) && (
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingId === booking._id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                                <span>Cancel</span>
                              </button>
                            )}
                            
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-500 text-right">
                            Booking ID: <span className="font-mono">{booking.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Booking Date: {formatDate(booking.createdAt)}</span>
                          <span>Event ID: <span className="font-mono">{booking.event?.eventId}</span></span>
                        </div>
                        
                        {new Date(booking.event?.startDate) > new Date() && booking.status !== 'CANCELLED' && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span>Starts in {Math.ceil((new Date(booking.event.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}