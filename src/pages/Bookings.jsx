import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  Loader,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Bookings() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const endpoint = user?.role === 'admin' ? '/bookings' : '/bookings/me';
      const res = await api.get(endpoint);
      const bookings = res.data.bookings || [];
      
      const calendarEvents = bookings.map(booking => ({
        id: booking._id,
        title: booking.event?.title || 'Untitled Event',
        start: new Date(booking.event?.startDate).toISOString(),
        extendedProps: {
          seats: booking.seats,
          status: booking.status,
          eventId: booking.event?._id,
          location: booking.event?.location,
          locationType: booking.event?.locationType,
          description: booking.event?.description
        },
        backgroundColor: getEventColor(booking.status),
        borderColor: getEventColor(booking.status),
        textColor: '#fff'
      }));
      
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  function getEventColor(status) {
    const colors = {
      confirmed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#6b7280'
    };
    return colors[status] || '#3b82f6';
  }

  function handleDateClick(info) {
    // You could implement creating new bookings or showing day details
    console.log('Date clicked:', info.dateStr);
  }

  function handleEventClick(clickInfo) {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      seats: clickInfo.event.extendedProps.seats,
      status: clickInfo.event.extendedProps.status,
      location: clickInfo.event.extendedProps.location,
      locationType: clickInfo.event.extendedProps.locationType,
      description: clickInfo.event.extendedProps.description
    });
    setShowModal(true);
  }

  const viewOptions = [
    { key: 'dayGridMonth', label: 'Month', icon: Grid },
    { key: 'timeGridWeek', label: 'Week', icon: Calendar },
    { key: 'timeGridDay', label: 'Day', icon: Clock },
    { key: 'listMonth', label: 'List', icon: List }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
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
              My Calendar
            </h1>
            <p className="text-xl text-gray-600">
              Manage and view all your event bookings in one place
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2 mt-4 lg:mt-0 bg-white rounded-2xl shadow-lg p-2">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => setView(option.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    view === option.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{option.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { label: 'Total Bookings', value: events.length, color: 'blue' },
            { label: 'Confirmed', value: events.filter(e => e.extendedProps.status === 'confirmed').length, color: 'green' },
            { label: 'Upcoming', value: events.filter(e => new Date(e.start) > new Date()).length, color: 'purple' },
            { label: 'Pending', value: events.filter(e => e.extendedProps.status === 'pending').length, color: 'yellow' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Calendar Container */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={view}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            events={events}
            height="70vh"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short'
            }}
            dayMaxEvents={3}
            nowIndicator={true}
            editable={false}
            selectable={true}
            weekends={true}
            dayHeaderClassNames="bg-gray-50 font-semibold text-gray-700"
            dayCellClassNames="hover:bg-gray-50 transition-colors"
          />
        </motion.div>

        {/* Event Details Modal */}
        <AnimatePresence>
          {showModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3" />
                    <span>{new Date(selectedEvent.start).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3" />
                    <span>{selectedEvent.seats} seat{selectedEvent.seats !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span className="capitalize">{selectedEvent.locationType} • {selectedEvent.location}</span>
                  </div>

                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      selectedEvent.status === 'confirmed' ? 'bg-green-500' :
                      selectedEvent.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="capitalize">{selectedEvent.status}</span>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}