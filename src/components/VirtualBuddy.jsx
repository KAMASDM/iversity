import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader, Bot } from 'lucide-react';
import { useBuddyStore, useEnrollmentStore, useAuthStore } from '../store';
import { getVirtualBuddyResponse } from '../services/geminiService';
import { saveChatMessage, getChatHistory } from '../services/firestoreService';
import { toast } from 'react-toastify';

const VirtualBuddy = () => {
  const { isOpen, toggleBuddy, chatHistory, setChatHistory, addMessage, loading, setLoading } = useBuddyStore();
  const { currentEnrollment, curriculum } = useEnrollmentStore();
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentEnrollment && chatHistory.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, currentEnrollment]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!currentEnrollment) return;

    try {
      const history = await getChatHistory(currentEnrollment.id);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setMessage('');
    setLoading(true);

    try {
      // Save user message
      if (currentEnrollment) {
        await saveChatMessage(currentEnrollment.id, userMessage);
      }

      // Get student context
      const studentContext = {
        currentModule: currentEnrollment?.currentModule || 'Introduction',
        progressPercentage: currentEnrollment?.progress || 0,
        recentTopics: curriculum?.modules?.slice(-3).map(m => m.title) || [],
        strugglingTopics: [], // Can be enhanced based on quiz performance
      };

      // Get AI response
      const response = await getVirtualBuddyResponse(
        message,
        chatHistory,
        studentContext
      );

      const buddyMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      addMessage(buddyMessage);

      // Save buddy message
      if (currentEnrollment) {
        await saveChatMessage(currentEnrollment.id, buddyMessage);
      }
    } catch (error) {
      console.error('Error getting buddy response:', error);
      toast.error('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Virtual Buddy</h3>
            <p className="text-xs opacity-90">Your AI Learning Assistant</p>
          </div>
        </div>
        <button
          onClick={toggleBuddy}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot size={48} className="mx-auto mb-4 text-primary-600" />
            <p className="font-medium">Hi! I'm your Virtual Buddy 👋</p>
            <p className="text-sm mt-2">Ask me anything about your course!</p>
          </div>
        )}

        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader className="animate-spin text-primary-600" size={20} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="btn-primary px-4 self-end"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default VirtualBuddy;
