import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Bookings from './pages/Bookings';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  const { loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/events/:id" element={<EventDetail/>} />
          <Route path="/create-event" element={<ProtectedRoute adminOnly><CreateEvent/></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </main>
    </div>
  );
}
