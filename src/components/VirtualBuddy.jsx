import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles, BookOpen, HelpCircle, Zap } from 'lucide-react';
import { useBuddyStore, useEnrollmentStore } from '../store';
import { saveChatMessage, getChatHistory, getPublishedCourses } from '../services/firestoreService';
import { buildKnowledgeBase, retrieveContext } from '../services/ragService';
import { askLocalBuddy } from '../services/localBuddyService';

const QUICK_QUESTIONS = [
  { icon: BookOpen, label: 'Explain a concept', text: 'Can you explain what Prompt Engineering is and why it matters?' },
  { icon: HelpCircle, label: 'What courses are available?', text: 'What courses does iVersity offer?' },
  { icon: Zap, label: 'How do I earn badges?', text: 'How does the gamification and badge system work?' },
  { icon: Sparkles, label: 'Study tips', text: 'What is the best way to study AI topics on iVersity?' },
];

// MODEL_STATES: 'idle' | 'downloading' | 'ready'
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-1 px-4 py-3 bg-white/10 rounded-2xl rounded-tl-sm border border-white/10">
      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const VirtualBuddy = () => {
  const { isOpen, toggleBuddy, chatHistory, setChatHistory, addMessage, loading, setLoading } = useBuddyStore();
  const { currentEnrollment } = useEnrollmentStore();
  const [message, setMessage] = useState('');
  const knowledgeRef = useRef([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Build RAG knowledge base once on mount
  useEffect(() => {
    (async () => {
      try {
        const courses = await getPublishedCourses();
        knowledgeRef.current = buildKnowledgeBase(courses);
      } catch (err) {
        console.warn('Buddy: knowledge base fallback to FAQ only', err);
        knowledgeRef.current = buildKnowledgeBase([]);
      }
    })();
  }, []);

  // Load stored chat history for the current enrollment
  useEffect(() => {
    if (isOpen && currentEnrollment && chatHistory.length === 0) {
      (async () => {
        try {
          const history = await getChatHistory(currentEnrollment.id);
          if (history.length > 0) setChatHistory(history);
        } catch (err) {
          console.error('Buddy: chat history load failed', err);
        }
      })();
    }
  }, [isOpen, currentEnrollment]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setMessage('');
    setLoading(true);

    try {
      if (currentEnrollment) saveChatMessage(currentEnrollment.id, userMsg).catch(() => {});

      // Retrieve relevant context via our own TF-IDF RAG
      const ragContext = retrieveContext(trimmed, knowledgeRef.current, 5);

      // Use our own local model (no API, no quota)
      const responseText = await askLocalBuddy(trimmed, ragContext);

      const buddyMsg = { role: 'assistant', content: responseText, timestamp: new Date().toISOString() };
      addMessage(buddyMsg);
      if (currentEnrollment) saveChatMessage(currentEnrollment.id, buddyMsg).catch(() => {});
    } catch (err) {
      console.error('Buddy error:', err);
      addMessage({
        role: 'assistant',
        content: "I ran into an issue. Please try again!",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(message); }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[380px] h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
      style={{ background: 'linear-gradient(145deg, #0f0f1a 0%, #13001f 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 bg-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Virtual Buddy</p>
            <p className="text-[11px] text-white/50 leading-tight">Local AI · No API · Instant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleBuddy}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chatHistory.length === 0 && !loading && (
          <div className="flex flex-col items-center pt-3 pb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center mb-3">
              <Sparkles size={28} className="text-purple-300" />
            </div>
            <p className="text-white font-semibold text-sm mb-1">Hey, I'm Buddy! 👋</p>
            <p className="text-white/50 text-xs text-center mb-1">
              Ask me anything about courses, concepts,<br />or how iVersity works.
            </p>
            <p className="text-[10px] text-purple-400/70 mb-5 text-center">
              Powered by your course content · zero external APIs
            </p>
            <div className="w-full grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-purple-500/40 text-left transition-all group"
                >
                  <q.icon size={14} className="text-purple-400 group-hover:text-purple-300" />
                  <span className="text-[11px] text-white/60 group-hover:text-white/80 leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-purple-600/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Bot size={13} className="text-purple-200" />
              </div>
            )}
            <div
              className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-blue-900/30'
                  : 'bg-white/8 text-gray-100 rounded-2xl rounded-tl-sm border border-white/10'
              }`}
            >
              {msg.content}
              <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200/70 text-right' : 'text-white/30'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/8 bg-black/20">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-white/8 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all max-h-24 overflow-y-auto disabled:opacity-50"
            style={{ lineHeight: '1.5' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage(message)}
            disabled={!message.trim() || loading}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-900/40"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default VirtualBuddy;
