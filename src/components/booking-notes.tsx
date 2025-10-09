import React, { useState } from 'react';

interface Note {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

const mockNotes: Note[] = [
  {
    id: 1,
    text: 'The client prefers a room with a view.',
    author: 'Agent Smith',
    timestamp: '2023-10-26 10:30 AM',
  },
  {
    id: 2,
    text: 'Checked with the hotel, view upgrade confirmed.',
    author: 'Agent Smith',
    timestamp: '2023-10-26 11:15 AM',
  },
];

const BookingNotes = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() === '') return;

    const newNoteObject: Note = {
      id: notes.length + 1,
      text: newNote,
      author: 'Current User', // Placeholder
      timestamp: new Date().toLocaleString(),
    };

    setNotes([...notes, newNoteObject]);
    setNewNote('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Booking Notes</h2>
      <div className="space-y-4 mb-6">
        {notes.map((note) => (
          <div key={note.id} className="border-b pb-2">
            <p className="text-gray-800">{note.text}</p>
            <p className="text-sm text-gray-500">
              {note.author} - {note.timestamp}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddNote}>
        <textarea
          className="w-full border rounded-md p-2"
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default BookingNotes;