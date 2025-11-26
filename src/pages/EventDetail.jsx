import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  Ticket,
  Shield,
  Star,
  Share2,
  Bookmark
} from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => { load(); }, [id]);

  async function load() {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.event);
    } catch (err) { 
      console.error(err);
      toast.show('Event not found', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!user) {
      toast.show('Please login to book events', 'warning');
      return nav('/login');
    }
    
    if (seats < 1 || seats > 2) {
      toast.show('You can only book 1-2 seats per event', 'error');
      return;
    }

    setBooking(true);
    try {
      const res = await api.post('/bookings', { event: id, seats });
      toast.show('🎉 Booking confirmed! Check your email for tickets.', 'success');
      nav('/my-bookings');
    } catch (err) {
      toast.show(err.response?.data?.message || 'Booking failed. Please try again.', 'error');
    } finally {
      setBooking(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link to="/events" className="text-blue-600 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header/Navigation */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/events"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Events</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Event Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {event.category || 'General'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {event.status || 'Upcoming'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {event.locationType || 'Online'}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>

              <div className="flex items-center text-lg text-gray-600 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">4.8</span>
                <span className="mx-2">•</span>
                <span>50+ attendees</span>
              </div>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-900">{formatDate(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {event.locationType} 
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Available Seats</p>
                    <p className="font-semibold text-gray-900">{event.capacity || '50'} seats</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Event ID</p>
                    <p className="font-semibold text-gray-900 font-mono">{event.eventId}</p>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {event.description || 'Join us for an incredible experience filled with learning, networking, and fun. This event brings together like-minded individuals to share knowledge and create memorable moments.'}
                </p>
              </div>
            </div>

            {/* What to Expect */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: '🎯', title: 'Expert Insights', desc: 'Learn from industry leaders' },
                  { icon: '🤝', title: 'Networking', desc: 'Connect with professionals' },
                  { icon: '💡', title: 'Practical Knowledge', desc: 'Actionable takeaways' },
                  { icon: '🎁', title: 'Resources', desc: 'Exclusive materials & tools' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Booking Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-xl sticky top-24 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Ticket className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Book Your Spot</h3>
                </div>
                <p className="text-blue-100 text-sm">Secure your place now</p>
              </div>

              {/* Pricing & Seats */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-gray-900">Free</span>
                  <span className="text-gray-600 ml-2">per seat</span>
                </div>

                {/* Seat Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Seats
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSeats(num)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          seats === num
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="block text-lg font-semibold">{num}</span>
                        <span className="text-sm">Seat{num !== 1 ? 's' : ''}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {[
                    'Instant confirmation',
                    'Free cancellation',
                    'Mobile ticket',
                    'Email reminders'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <motion.button
                  onClick={handleBook}
                  disabled={booking}
                  whileHover={{ scale: booking ? 1 : 1.02 }}
                  whileTap={{ scale: booking ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {booking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Book Now
                    </>
                  )}
                </motion.button>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Secure booking • SSL encrypted</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-semibold text-gray-900 mb-4">Event Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Seats Available</span>
                  <span className="font-semibold text-gray-900">{event.capacity || '50'}</span>
                </div>
              
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Event Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{event.locationType}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}