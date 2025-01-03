'use client'; // Mark this file as a client component
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import necessary CSS
import "./globals.css";

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    setLoading(true); // Start loading

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time, guests, name, contact }),
    });

    const data = await res.json();

    if (res.status === 400) {
      setErrorMessage(data.message); // Show error message if slot is already booked
    } else if (res.status === 200) {
      setConfirmation(data); // Show confirmation if booking is successful
    }

    setLoading(false); // Stop loading
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl text-center mb-6">Restaurant Table Booking</h1>

      {errorMessage && (
        <div className="bg-red-300 p-4 rounded text-center mb-4 text-red-800">
          <strong>{errorMessage}</strong>
        </div>
      )}

      {loading ? (
        <div className="text-center">Processing your booking...</div>
      ) : !confirmation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Date:</label>
            <DatePicker
              selected={date}
              onChange={setDate}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Time:</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              {['12:00', '14:00', '16:00', '18:00', '20:00'].map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Guests:</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Contact:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Book Table
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-4">Booking Confirmation</h2>
          <p className="mb-2"><strong>Date:</strong> {confirmation.date}</p>
          <p className="mb-2"><strong>Time:</strong> {confirmation.time}</p>
          <p className="mb-2"><strong>Guests:</strong> {confirmation.guests}</p>
          <p className="mb-2"><strong>Name:</strong> {confirmation.name}</p>
          <p className="mb-4"><strong>Contact:</strong> {confirmation.contact}</p>
          <button
            onClick={() => setConfirmation(null)} // Clear the confirmation to reset the form
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Make Another Booking
          </button>
        </div>
      )}
    </div>
  );
}
