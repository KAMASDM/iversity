import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles, BookOpen, HelpCircle, Zap, GraduationCap, Brain, Lightbulb, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useBuddyStore, useEnrollmentStore } from '../store';
import { saveChatMessage, getChatHistory, getPublishedCourses } from '../services/firestoreService';
import { buildKnowledgeBase, retrieveContext } from '../services/ragService';
import { getVirtualBuddyResponse } from '../services/openaiService';
import { askLocalBuddy } from '../services/localBuddyService';

// Quick-question chips shown on the empty state screen
const QUICK_QUESTIONS = [
  { icon: BookOpen,      label: 'Explain this lesson',     text: 'Can you explain what we just covered in this lesson in simple terms?' },
  { icon: HelpCircle,    label: 'What courses are there?', text: 'What courses does iVersity offer and which one suits me as a beginner?' },
  { icon: Brain,         label: 'Quiz me!',                text: 'Quiz me with 4 multiple choice questions on what I just learned.' },
  { icon: Lightbulb,     label: 'Real-world example',      text: 'Give me a real-world example of how this concept is actually used in practice.' },
  { icon: GraduationCap, label: 'How do I ace exams?',     text: 'What are the best strategies to prepare for the final exam and earn my certificate?' },
  { icon: Zap,           label: 'How do I earn badges?',   text: 'How does XP and the badge system work? What badges can I earn?' },
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ── Interactive Multiple-Choice Quiz Card ────────────────────────────────────
const QuizCard = ({ questions, answers, onAnswer }) => {
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.filter(q => answers[q.id] === q.correct).length;

  return (
    <div className="space-y-3 mt-1 w-full">
      {questions.map((q, qi) => {
        const selected = answers[q.id];
        const answered = selected !== undefined;

        return (
          <div
            key={q.id}
            className="rounded-xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {/* Question header */}
            <div className="px-3.5 pt-3 pb-2">
              <p className="text-[10px] font-medium text-purple-400/70 uppercase tracking-wider mb-1.5">
                Question {qi + 1} of {questions.length}
              </p>
              <p className="text-sm text-white leading-snug font-medium">{q.question}</p>
            </div>

            {/* Options */}
            <div className="px-3.5 pb-3 space-y-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect  = oi === q.correct;
                const isSelected = oi === selected;

                let cls = 'bg-white/5 border-white/10 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 cursor-pointer';
                if (answered) {
                  if (isCorrect)                     cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 cursor-default';
                  else if (isSelected && !isCorrect) cls = 'bg-red-500/15 border-red-500/50 text-red-300 cursor-default';
                  else                               cls = 'bg-white/2 border-white/5 text-white/25 cursor-default';
                }

                return (
                  <button
                    key={oi}
                    disabled={answered}
                    onClick={() => onAnswer(q.id, oi)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all duration-200 flex items-center gap-2.5 ${cls}`}
                  >
                    {/* Option label badge */}
                    <span
                      className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-colors ${
                        answered && isCorrect  ? 'bg-emerald-500/30 text-emerald-300' :
                        answered && isSelected ? 'bg-red-500/30 text-red-300' :
                        answered               ? 'bg-white/5 text-white/20' :
                                                 'bg-white/10 text-white/60'
                      }`}
                    >
                      {OPTION_LABELS[oi]}
                    </span>

                    <span className="flex-1 leading-snug">{opt}</span>

                    {/* Result icon */}
                    {answered && isCorrect  && <CheckCircle size={14} className="flex-shrink-0 text-emerald-400" />}
                    {answered && isSelected && !isCorrect && <XCircle size={14} className="flex-shrink-0 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation — appears after answering */}
            {answered && q.explanation && (
              <div className="mx-3.5 mb-3 px-3 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-[11px] text-blue-200 leading-relaxed">
                  <span className="text-blue-400 font-semibold">💡 </span>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Score summary — appears when all answered */}
      {allAnswered && (
        <div
          className="rounded-xl p-4 text-center border border-white/10"
          style={{ background: 'rgba(139,92,246,0.12)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy size={16} className="text-yellow-400" />
            <p className="text-white font-bold text-base">{score} / {questions.length}</p>
          </div>
          <p className="text-white/60 text-xs">
            {score === questions.length
              ? 'Perfect score! You nailed it 🎉'
              : score >= Math.ceil(questions.length * 0.75)
              ? 'Great job! Almost there 💪'
              : score >= Math.ceil(questions.length * 0.5)
              ? 'Solid effort! Review the ones you missed 📖'
              : 'Keep going — revisit the lesson and try again! 📚'}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Typing / thinking animation ──────────────────────────────────────────────
const TypingIndicator = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex justify-start items-end gap-2">
      <div className="w-6 h-6 rounded-lg bg-purple-600/50 flex items-center justify-center flex-shrink-0 mb-0.5">
        <Bot size={13} className="text-purple-200" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm border border-purple-500/20 flex flex-col gap-1.5"
        style={{ background: 'rgba(139,92,246,0.08)' }}
      >
        <p className="text-[11px] text-purple-300/70 font-medium tracking-wide select-none">
          Buddy is thinking{'.'.repeat(dots)}
        </p>
        <div className="flex items-end gap-[3px] h-4">
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-purple-500 to-blue-400"
              style={{ animation: `buddyBar 1s ease-in-out ${i * 0.12}s infinite`, height: '8px' }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes buddyBar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%       { transform: scaleY(1.8); opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const VirtualBuddy = () => {
  const {
    isOpen, toggleBuddy,
    chatHistory, setChatHistory, addMessage,
    loading, setLoading,
    courseContext,
  } = useBuddyStore();

  const { currentEnrollment } = useEnrollmentStore();
  const [message, setMessage] = useState('');
  // quizAnswers: { [msgTimestamp]: { [questionId]: selectedOptionIndex } }
  const [quizAnswers, setQuizAnswers] = useState({});
  const knowledgeRef = useRef([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const handleQuizAnswer = (msgTimestamp, questionId, optionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [msgTimestamp]: {
        ...(prev[msgTimestamp] || {}),
        [questionId]: optionIndex,
      },
    }));
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setMessage('');
    setLoading(true);

    try {
      if (currentEnrollment) saveChatMessage(currentEnrollment.id, userMsg).catch(() => {});

      const studentContext = {
        courseName:           courseContext?.courseName           || currentEnrollment?.courseName || null,
        currentChapter:       courseContext?.currentChapter       || null,
        currentLesson:        courseContext?.currentLesson        || null,
        currentLessonContent: courseContext?.currentLessonContent || null,
        progressPercentage:   courseContext?.progressPercentage   ?? currentEnrollment?.progress ?? 0,
      };

      let buddyMsg;
      try {
        // Returns { response, quiz } — quiz is null for normal replies
        const result = await getVirtualBuddyResponse(
          trimmed,
          chatHistory,
          studentContext,
          knowledgeRef.current
        );
        buddyMsg = {
          role: 'assistant',
          content: result.response,
          quiz: result.quiz || null,
          timestamp: new Date().toISOString(),
        };
      } catch (apiErr) {
        console.warn('[Buddy] API failed. Reason:', apiErr?.message || apiErr);
        // Quiz requests need the AI backend — local extractive search can't generate MCQs
        const isQuizLike = /quiz|test me|ask me|multiple.?choice|practice question|check my understanding/i.test(trimmed);
        if (isQuizLike) {
          buddyMsg = {
            role: 'assistant',
            content: "I need my AI backend to generate quiz questions, but it seems to be temporarily unavailable. Please try again in a moment — it usually comes back quickly!",
            quiz: null,
            timestamp: new Date().toISOString(),
          };
        } else {
          const ragContext = retrieveContext(trimmed, knowledgeRef.current, 8);
          const responseText = await askLocalBuddy(trimmed, ragContext);
          buddyMsg = { role: 'assistant', content: responseText, quiz: null, timestamp: new Date().toISOString() };
        }
      }

      addMessage(buddyMsg);
      if (currentEnrollment) saveChatMessage(currentEnrollment.id, buddyMsg).catch(() => {});
    } catch (err) {
      console.error('[Buddy] Unexpected error:', err);
      addMessage({
        role: 'assistant',
        content: 'Something went wrong on my end. Please try refreshing the page, or ask me again!',
        quiz: null,
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

  const quickQuestions = courseContext?.currentLesson
    ? QUICK_QUESTIONS
    : QUICK_QUESTIONS.filter(q => q.label !== 'Explain this lesson');

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[390px] h-[620px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10"
      style={{ background: 'linear-gradient(155deg, #0d0d1c 0%, #110020 60%, #0a0a18 100%)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700/70 to-blue-700/70 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-purple-500/30">
              <Bot size={20} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#110020] bg-emerald-400 shadow shadow-emerald-500/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Buddy</p>
            <p className="text-[11px] text-white/50 leading-tight">
              {courseContext?.currentLesson
                ? `${courseContext.currentLesson.slice(0, 28)}${courseContext.currentLesson.length > 28 ? '…' : ''}`
                : 'Your AI Tutor · ASC powered'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleBuddy}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Buddy"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {chatHistory.length === 0 && !loading && (
          <div className="flex flex-col items-center pt-2 pb-2">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/25 to-blue-500/25 border border-white/10 flex items-center justify-center">
                <Sparkles size={30} className="text-purple-300" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#110020] bg-emerald-400 shadow shadow-emerald-500/60" />
            </div>
            <p className="text-white font-bold text-base mb-1">Hey, I'm Buddy! 👋</p>
            <p className="text-white/50 text-xs text-center leading-relaxed mb-1">
              I'm your personal AI tutor — ask me anything about<br />
              {courseContext?.courseName
                ? <><span className="text-purple-300 font-medium">{courseContext.courseName}</span>, concepts, or the platform.</>
                : 'your courses, AI concepts, or the platform.'}
            </p>
            <p className="text-[10px] text-purple-400/60 mb-5 text-center">Powered by ASC · Understands your course</p>
            <div className="w-full grid grid-cols-2 gap-2">
              {quickQuestions.slice(0, 6).map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.text)}
                  className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/8 hover:border-purple-500/40 text-left transition-all duration-150 group"
                >
                  <q.icon size={14} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-[11px] text-white/55 group-hover:text-white/80 leading-snug transition-colors">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-purple-600/50 flex items-center justify-center flex-shrink-0 mb-0.5">
                <Bot size={13} className="text-purple-200" />
              </div>
            )}

            {msg.role === 'assistant' && msg.quiz ? (
              /* ── Quiz message ── */
              <div className="flex-1 min-w-0">
                {/* Intro text */}
                <div
                  className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm border border-white/10 text-sm text-gray-100 leading-relaxed mb-2"
                  style={{ background: 'rgba(139,92,246,0.08)' }}
                >
                  {msg.content}
                  <p className="text-[10px] text-white/25 mt-1.5">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {/* Interactive quiz */}
                <QuizCard
                  questions={msg.quiz.questions}
                  answers={quizAnswers[msg.timestamp] || {}}
                  onAnswer={(qId, oi) => handleQuizAnswer(msg.timestamp, qId, oi)}
                />
              </div>
            ) : (
              /* ── Normal message ── */
              <div
                className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-sm shadow-lg shadow-blue-900/30'
                    : 'text-gray-100 rounded-2xl rounded-tl-sm border border-white/10'
                }`}
                style={msg.role === 'assistant' ? { background: 'rgba(139,92,246,0.08)' } : {}}
              >
                {msg.content}
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200/70 text-right' : 'text-white/25'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 py-3 border-t border-white/8 bg-black/25">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={courseContext?.currentLesson ? `Ask about "${courseContext.currentLesson.slice(0, 24)}…"` : 'Ask me anything…'}
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
            aria-label="Send message"
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

