import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Eye,
  Trash2,
  Edit,
  Download,
  Filter,
  Search,
  Loader,
  User,
  Mail,
  Ticket,
  BarChart3,
  Shield
} from 'lucide-react';

export default function CreateEvent() {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    locationType: 'Online', 
    location: '', 
    startDate: '', 
    capacity: 50 
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const toast = useToast();

  // Load all events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setEventsLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Error loading events:', err);
      toast.show('Failed to load events', 'error');
    } finally {
      setEventsLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/events', form);
      toast.show('🎉 Event created successfully!', 'success');
      setForm({ 
        title: '', 
        description: '', 
        category: '', 
        locationType: 'Online', 
        location: '', 
        startDate: '', 
        capacity: 50 
      });
      loadEvents(); // Refresh events list
      setActiveTab('manage'); // Switch to manage tab
    } catch (err) {
      toast.show(err.response?.data?.message || 'Event creation failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendees(eventId) {
    setAttendeesLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/attendees`);
      setAttendees(res.data.attendees || []);
      setSelectedEvent(events.find(e => e._id === eventId));
      setShowAttendees(true);
    } catch (err) {
      toast.show('Failed to load attendees', 'error');
    } finally {
      setAttendeesLoading(false);
    }
  }

  async function deleteEvent(eventId) {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.show('Event deleted successfully', 'success');
      loadEvents();
    } catch (err) {
      toast.show('Failed to delete event', 'error');
    }
  }

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

  const getEventStats = (event) => {
    const totalAttendees = attendees.filter(a => a.eventId === event._id).length;
    const filledPercentage = event.capacity ? (totalAttendees / event.capacity) * 100 : 0;
    
    return {
      totalAttendees,
      filledPercentage,
      remainingSeats: event.capacity - totalAttendees
    };
  };

  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Event Management
            </h1>
            <p className="text-xl text-gray-600">
              Create and manage all events on the platform
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex border-b border-gray-200">
            {[
              { key: 'create', label: 'Create Event', icon: Plus },
              { key: 'manage', label: 'Manage Events', icon: Calendar },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Create Event Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Form */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Plus className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                        <p className="text-gray-600">Fill in the details to create an amazing event</p>
                      </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Title *
                        </label>
                        <input
                          required
                          placeholder="Enter event title"
                          value={form.title}
                          onChange={e => setForm({...form, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          placeholder="Describe your event..."
                          value={form.description}
                          onChange={e => setForm({...form, description: e.target.value})}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={form.category}
                            onChange={e => setForm({...form, category: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                            <option value="Music">Music</option>
                            <option value="Tech">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Education">Education</option>
                            <option value="Arts">Arts</option>
                            <option value="Sports">Sports</option>
                          </select>
                        </div>

                        {/* Location Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location Type
                          </label>
                          <select
                            value={form.locationType}
                            onChange={e => setForm({...form, locationType: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="Online">Online</option>
                            <option value="In-Person">In-Person</option>
                          </select>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {form.locationType === 'Online' ? 'Meeting URL' : 'Venue Address'} *
                        </label>
                        <input
                          required
                          placeholder={form.locationType === 'Online' ? 'https://meet.google.com/...' : '123 Event Street, City, State'}
                          value={form.location}
                          onChange={e => setForm({...form, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Date & Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date & Time *
                          </label>
                          <input
                            type="datetime-local"
                            required
                            value={form.startDate}
                            onChange={e => setForm({...form, startDate: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        {/* Capacity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="1000"
                            value={form.capacity}
                            onChange={e => setForm({...form, capacity: Number(e.target.value)})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating Event...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            Create Event
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>

                  {/* Preview */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Event Preview</h3>
                    <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {form.title || 'Event Title'}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {form.category || 'Category'} • {form.locationType}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Draft
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm">
                        {form.description || 'Event description will appear here...'}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {form.startDate ? formatDate(form.startDate) : 'Date not set'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{form.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Capacity: {form.capacity} attendees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manage Events */}
            {activeTab === 'manage' && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">All Events</h2>
                      <p className="text-gray-600">Manage and monitor all platform events</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search events..."
                          className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  {eventsLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-20">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Created</h3>
                      <p className="text-gray-600 mb-6">Create your first event to get started</p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Create Event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {events.map((event, index) => (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            {/* Event Info */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                  {event.category || 'General'}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {event.status || 'Upcoming'}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                  {event.locationType}
                                </span>
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {event.title}
                              </h3>

                              <p className="text-gray-700 mb-4 line-clamp-2">
                                {event.description}
                              </p>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span>{formatDate(event.startDate)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-green-600" />
                                  <span className="capitalize">{event.locationType}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-purple-600" />
                                  <span>{event.capacity} capacity</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Ticket className="w-4 h-4 text-orange-600" />
                                  <span className="font-mono text-xs">{event.eventId}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-3 lg:items-end">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {getEventStats(event).totalAttendees}
                                </div>
                                <div className="text-sm text-gray-500">Attendees</div>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => loadAttendees(event._id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Attendees</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                                  <Edit className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => deleteEvent(event._id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center py-20">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">Coming soon - Advanced analytics and insights</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Attendees Modal */}
      <AnimatePresence>
        {showAttendees && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAttendees(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Event Attendees</h3>
                    <p className="text-blue-100">{selectedEvent?.title}</p>
                  </div>
                  <button
                    onClick={() => setShowAttendees(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <Clock className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {attendeesLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Attendees Yet</h4>
                    <p className="text-gray-600">No one has booked this event yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {attendees.length} Attendee{attendees.length !== 1 ? 's' : ''}
                        </h4>
                        <p className="text-gray-600">Total bookings for this event</p>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="grid gap-4">
                      {attendees.map((attendee, index) => (
                        <motion.div
                          key={`${attendee.bookingId}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {attendee.user?.name || 'Unknown User'}
                              </p>
                              <p className="text-sm text-gray-600">{attendee.user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Ticket className="w-4 h-4" />
                              <span>Booking ID: {attendee.bookingId}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}