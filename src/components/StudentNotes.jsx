import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { saveNote, getNotes, deleteNote } from '../services/firestoreService';
import { toast } from 'react-toastify';
import { Plus, X, Save, Edit2, Trash2, Clock } from 'lucide-react';

const StudentNotes = ({ courseId, chapterId, lessonId }) => {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [courseId, chapterId, lessonId]);

  const loadNotes = async () => {
    try {
      const data = await getNotes(user.uid, courseId, chapterId, lessonId);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setLoading(true);
    try {
      await saveNote({
        userId: user.uid,
        courseId,
        chapterId,
        lessonId,
        content: newNote,
        timestamp: new Date().toISOString(),
      });
      
      setNewNote('');
      setShowForm(false);
      await loadNotes();
      toast.success('Note saved!');
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Delete this note?')) return;

    try {
      await deleteNote(noteId);
      await loadNotes();
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Edit2 size={20} className="text-blue-400" />
          My Notes
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {showForm ? (
            <X size={20} className="text-white" />
          ) : (
            <Plus size={20} className="text-white" />
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write your note here..."
            rows={4}
          />
          <button
            onClick={handleSaveNote}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No notes yet. Start taking notes!</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(note.timestamp)}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotes;
