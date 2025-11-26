import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api/api";

export default function BookingModal({ open, onClose, event }) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { notify } = useToast();

  if (!open || !event) return null;

  const handleBooking = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        "/bookings",
        { event: event._id, seats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notify("Booking successful! Check your email for the PDF ticket.");
      onClose();
    } catch (err) {
      notify(err.response?.data?.message || "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-3">{event.title}</h2>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <label className="block text-sm font-medium mb-1">Seats:</label>
        <select
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="border rounded-lg w-full p-2"
        >
          <option value={1}>1 Seat</option>
          <option value={2}>2 Seats</option>
        </select>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
