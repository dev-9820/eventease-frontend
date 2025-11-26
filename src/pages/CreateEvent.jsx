import React, { useState } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

export default function CreateEvent(){
  const [form, setForm] = useState({ title:'', description:'', category:'', locationType:'Online', location:'', startDate:'', capacity:50 });
  const toast = useToast();

  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/events', form);
      toast.show('Event created');
    } catch (err) {
      toast.show(err.response?.data?.message || 'Create failed', 'error');
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Event</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border p-2 rounded" />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border p-2 rounded"></textarea>
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border p-2 rounded" />
        <input placeholder="Location (or URL)" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full border p-2 rounded" />
        <input type="datetime-local" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="w-full border p-2 rounded" />
        <input type="number" value={form.capacity} onChange={e=>setForm({...form, capacity:Number(e.target.value)})} className="w-full border p-2 rounded" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
