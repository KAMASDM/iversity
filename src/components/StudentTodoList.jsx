import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { saveTodo, getTodos, updateTodo, deleteTodo } from '../services/firestoreService';
import { toast } from 'react-toastify';
import { Plus, X, CheckCircle, Circle, Trash2 } from 'lucide-react';

const StudentTodoList = ({ courseId }) => {
  const { user } = useAuthStore();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [courseId]);

  const loadTodos = async () => {
    try {
      const data = await getTodos(user.uid, courseId);
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      toast.error('Please enter a task');
      return;
    }

    setLoading(true);
    try {
      await saveTodo({
        userId: user.uid,
        courseId,
        title: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      
      setNewTodo('');
      setShowForm(false);
      await loadTodos();
      toast.success('Task added!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
      await updateTodo(todoId, { completed: !completed });
      await loadTodos();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      await loadTodos();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">My Tasks</h3>
          <p className="text-sm text-gray-400">
            {completedCount} of {todos.length} completed
          </p>
        </div>
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
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="What do you need to do?"
          />
          <button
            onClick={handleAddTodo}
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tasks yet. Add your first task!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => handleToggleTodo(todo.id, todo.completed)}
                className="flex-shrink-0"
              >
                {todo.completed ? (
                  <CheckCircle size={20} className="text-green-400" />
                ) : (
                  <Circle size={20} className="text-gray-400" />
                )}
              </button>
              <span
                className={`flex-1 text-white ${
                  todo.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentTodoList;
