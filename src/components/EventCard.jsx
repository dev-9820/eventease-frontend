import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowRight,
  Star
} from 'lucide-react';

export default function EventCard({ event, index = 0 }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      music: 'bg-purple-100 text-purple-800',
      tech: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      art: 'bg-pink-100 text-pink-800',
      education: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Event Image/Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              event.status?.toLowerCase() === 'upcoming' ? 'bg-green-500' :
              event.status?.toLowerCase() === 'ongoing' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            {event.status || 'Upcoming'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category || 'Event'}
          </span>
        </div>

        {/* Featured Badge */}
        {index < 3 && (
          <div className="absolute top-16 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1 fill-yellow-400" />
              Featured
            </span>
          </div>
        )}

        {/* View Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/events/${event._id}`}
            className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Event Date & Time */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(event.startDate)}</span>
        </div>

        {/* Event Title */}
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {event.description || 'Join us for an amazing experience filled with learning and networking opportunities.'}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="capitalize">{event.locationType || 'Online'} • {event.location || 'Virtual Event'}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.capacity || '50'} seats available</span>
          </div>

          {/* Event ID */}
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-mono text-xs">{event.eventId}</span>
          </div>
        </div>


        {/* Action Button */}
        <Link
          to={`/events/${event._id}`}
          className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}