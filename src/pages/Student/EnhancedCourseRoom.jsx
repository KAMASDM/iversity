import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import StudentNotes from '../../components/StudentNotes';
import StudentTodoList from '../../components/StudentTodoList';
import Gamification from '../../components/Gamification';
import { 
  getEnrollment, 
  getCourse, 
  getCurriculum,
  updateEnrollmentProgress,
  awardPoints,
  updateStreak,
  awardBadge,
  saveQuizResult,
  getCoursePptFiles
} from '../../services/firestoreService';
import { generateAdaptiveQuiz } from '../../services/geminiService';
import { useAuthStore, useBuddyStore } from '../../store';
import { toast } from 'react-toastify';
import { 
  BookOpen, CheckCircle, Lock, Play, ChevronLeft, ChevronRight,
  Clock, Brain, FileText, Target, TrendingUp, Award, MessageCircle,
  Download, ExternalLink, Video, File, Lightbulb, ArrowRight,
  List, X, Menu, Youtube, Minus
} from 'lucide-react';

// Inline markdown renderer — converts **bold**, *italic*, `code` to JSX
const renderInline = (text) => {
  const parts = [];
  // Split on bold, italic, inline-code markers
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++} className="text-white font-semibold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(<code key={key++} className="px-1.5 py-0.5 bg-white/10 text-purple-300 rounded text-sm font-mono">{token.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={key++} className="italic text-gray-300">{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
};

// Presentation Renderer Component
const PresentationRenderer = ({ content }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  
  // Reset to first slide whenever the lesson content changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [content]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);
  
  // Parse markdown-style content into slides
  const parseContentToSlides = (text) => {
    const slides = [];
    const lines = text.split('\n');
    let currentSlideContent = { title: '', content: [] };

    // Strip raw markdown formatting for headings only
    const cleanHeading = (str) => str
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .trim();

    let inCodeBlock = false;
    let codeLines = [];
    let codeLang = '';
    let tableRows = [];

    const flushTable = () => {
      if (tableRows.length === 0) return;
      // Filter out pure separator rows (e.g. |---|---|)
      const filtered = tableRows.filter(row => !row.every(cell => /^[-:\s]+$/.test(cell)));
      if (filtered.length > 0) {
        currentSlideContent.content.push({ type: 'table', rows: filtered });
      }
      tableRows = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();

      // ── Code block handling ──────────────────────────────────────────
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushTable();
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          inCodeBlock = false;
          currentSlideContent.content.push({ type: 'code', language: codeLang, lines: codeLines });
          codeLines = [];
          codeLang = '';
        }
        continue;
      }
      if (inCodeBlock) {
        codeLines.push(rawLine); // preserve original indentation
        continue;
      }

      // ── Table row handling ───────────────────────────────────────────
      if (line.startsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);
        tableRows.push(cells);
        continue;
      } else {
        flushTable();
      }

      // ── Headings ────────────────────────────────────────────────────
      // Main heading (# ) creates new slide
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        if (currentSlideContent.title || currentSlideContent.content.length > 0) {
          slides.push({ ...currentSlideContent });
        }
        currentSlideContent = { 
          title: cleanHeading(line.replace(/^#\s+/, '')), 
          content: [],
          type: 'title'
        };
      }
      // Subheading (## ) creates content section
      else if (line.startsWith('## ')) {
        if (currentSlideContent.title && currentSlideContent.content.length > 0) {
          slides.push({ ...currentSlideContent });
          currentSlideContent = { title: '', content: [], type: 'content' };
        }
        currentSlideContent.title = cleanHeading(line.replace(/^##\s+/, ''));
        currentSlideContent.type = 'content';
      }
      // Sub-subheading (### ) — render as a labelled section divider
      else if (line.startsWith('### ')) {
        currentSlideContent.content.push({
          type: 'subheading',
          text: cleanHeading(line.replace(/^###\s+/, ''))
        });
      }
      // List items
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        currentSlideContent.content.push({
          type: 'bullet',
          text: line.replace(/^[-*]\s+/, '')
        });
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        currentSlideContent.content.push({
          type: 'numbered',
          text: line.replace(/^\d+\.\s+/, '')
        });
      }
      // Regular paragraphs
      else if (line.length > 0) {
        currentSlideContent.content.push({
          type: 'paragraph',
          text: line
        });
      }
    }

    // Flush any trailing table or code block
    flushTable();
    if (inCodeBlock && codeLines.length > 0) {
      currentSlideContent.content.push({ type: 'code', language: codeLang, lines: codeLines });
    }
    // Add the last slide
    if (currentSlideContent.title || currentSlideContent.content.length > 0) {
      slides.push(currentSlideContent);
    }
    
    return slides.length > 0 ? slides : [{ title: 'Content', content: [{ type: 'paragraph', text: content }], type: 'content' }];
  };

  const slides = parseContentToSlides(content);
  const totalSlides = slides.length;
  // Clamp index in case it's stale from a previous lesson
  const safeIndex = Math.min(currentSlide, totalSlides - 1);
  const slide = slides[safeIndex];

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide(); else prevSlide();
    }
    setTouchStartX(null);
  };

  // Capped dot pagination: show max 7 dots with current always visible
  const MAX_DOTS = 7;
  const getDotIndices = () => {
    if (totalSlides <= MAX_DOTS) return Array.from({ length: totalSlides }, (_, i) => i);
    const half = Math.floor(MAX_DOTS / 2);
    let start = Math.max(0, currentSlide - half);
    let end = start + MAX_DOTS - 1;
    if (end >= totalSlides) { end = totalSlides - 1; start = Math.max(0, end - MAX_DOTS + 1); }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Slide Display */}
      <div
        className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-xl sm:rounded-2xl border-2 border-purple-500/30 overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[500px] shadow-2xl select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Slide Content */}
        <div className="relative z-10 p-4 sm:p-8 lg:p-12 min-h-[280px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center">
          {slide.type === 'title' ? (
            // Title Slide
            <div className="text-center">
              <div className="mb-4">
                <Lightbulb className="mx-auto text-yellow-400 animate-pulse" size={40} />
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                {slide.title}
              </h1>
              {slide.content.length > 0 && (
                <div className="space-y-3 max-w-3xl mx-auto">
                  {slide.content.map((item, idx) => (
                    <p key={idx} className="text-sm sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                      {renderInline(item.text)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Content Slide
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-8 border-b-4 border-purple-500 pb-2 sm:pb-4 inline-block">
                {slide.title}
              </h2>
              <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-8">
                {slide.content.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`animate-fade-in ${
                      item.type === 'code' || item.type === 'table'
                        ? ''
                        : item.type === 'subheading'
                        ? 'pt-1.5 sm:pt-2'
                        : 'flex items-start gap-2 sm:gap-4 p-2.5 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10'
                    }`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Bullet */}
                    {item.type === 'bullet' && (
                      <>
                        <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 sm:mt-2"></div>
                        <p className="text-sm sm:text-xl text-gray-200 leading-relaxed flex-1">{renderInline(item.text)}</p>
                      </>
                    )}
                    {/* Numbered */}
                    {item.type === 'numbered' && (
                      <>
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-sm sm:text-xl text-gray-200 leading-relaxed flex-1">{renderInline(item.text)}</p>
                      </>
                    )}
                    {/* Paragraph */}
                    {item.type === 'paragraph' && (
                      <p className="text-sm sm:text-xl text-gray-200 leading-relaxed">{renderInline(item.text)}</p>
                    )}
                    {/* Sub-subheading (###) */}
                    {item.type === 'subheading' && (
                      <h3 className="text-base sm:text-2xl font-semibold text-purple-300 border-l-4 border-purple-500 pl-3 sm:pl-4 py-1">
                        {item.text}
                      </h3>
                    )}
                    {/* Code block */}
                    {item.type === 'code' && (
                      <div className="w-full rounded-lg sm:rounded-xl overflow-hidden border border-white/10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/90 border-b border-white/10">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                          </div>
                          {item.language && (
                            <span className="text-xs text-gray-400 font-mono ml-1 uppercase tracking-wide">{item.language}</span>
                          )}
                        </div>
                        <pre className="bg-gray-950/90 p-3 sm:p-4 overflow-x-auto max-h-52 sm:max-h-72">
                          <code className="text-green-300 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre">
                            {item.lines.join('\n')}
                          </code>
                        </pre>
                      </div>
                    )}
                    {/* Markdown table */}
                    {item.type === 'table' && (
                      <div className="w-full overflow-x-auto rounded-lg sm:rounded-xl border border-white/10">
                        <table className="w-full">
                          <tbody>
                            {item.rows.map((row, rowIdx) => (
                              <tr key={rowIdx} className={rowIdx === 0 ? 'bg-purple-500/25' : rowIdx % 2 === 0 ? 'bg-white/5' : ''}>
                                {row.map((cell, cellIdx) => (
                                  rowIdx === 0
                                    ? <th key={cellIdx} className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-purple-200 border-b border-white/10">{renderInline(cell)}</th>
                                    : <td key={cellIdx} className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-200 border-b border-white/5">{renderInline(cell)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Slide counter badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <span className="text-white text-xs sm:text-sm font-semibold">{currentSlide + 1} / {totalSlides}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Capped dot pagination */}
        <div className="flex gap-1.5 items-center">
          {getDotIndices()[0] > 0 && <span className="text-gray-500 text-xs">&#8230;</span>}
          {getDotIndices().map((idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all ${
                idx === currentSlide 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6 h-2.5' 
                  : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          {getDotIndices()[getDotIndices().length - 1] < totalSlides - 1 && <span className="text-gray-500 text-xs">&#8230;</span>}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Keyboard hint — desktop only */}
      <div className="hidden sm:block text-center text-sm text-gray-400">
        <p>Tip: Use arrow keys to navigate slides</p>
      </div>
    </div>
  );
};

// Load the YouTube IFrame API script once
const ensureYouTubeAPI = () => {
  if (window.YT?.Player || document.getElementById('yt-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
};

const extractVideoId = (rawUrl) => {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get('v') || u.pathname.replace(/^\/(shorts\/)?/, '').split('/')[0];
  } catch {
    return null;
  }
};

// Floating YouTube Video Player — saves watch position to localStorage
const FloatingVideoPlayer = ({ url, title, lessonId, userId, onClose }) => {
  const [minimised, setMinimised] = useState(false);
  const divRef = useRef(null);
  const playerRef = useRef(null);
  const saveTimerRef = useRef(null);
  const storageKey = `vp_${userId}_${lessonId}`;

  const getSavedTime = () => {
    try { return parseInt(localStorage.getItem(storageKey) || '0', 10); } catch { return 0; }
  };

  const saveCurrentTime = useCallback(() => {
    try {
      if (playerRef.current?.getCurrentTime) {
        localStorage.setItem(storageKey, String(Math.floor(playerRef.current.getCurrentTime())));
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  const initPlayer = useCallback(() => {
    if (!divRef.current || !window.YT?.Player) return;
    const videoId = extractVideoId(url);
    if (!videoId) return;
    playerRef.current = new window.YT.Player(divRef.current, {
      videoId,
      playerVars: { autoplay: 1, start: getSavedTime(), rel: 0 },
      events: {
        onStateChange: ({ data }) => {
          clearInterval(saveTimerRef.current);
          if (data === window.YT.PlayerState.PLAYING) {
            saveTimerRef.current = setInterval(saveCurrentTime, 5000);
          } else {
            saveCurrentTime();
          }
        },
      },
    });
  }, [url, saveCurrentTime]);

  useEffect(() => {
    ensureYouTubeAPI();
    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
    }
    return () => {
      clearInterval(saveTimerRef.current);
      saveCurrentTime();
      playerRef.current?.destroy?.();
    };
  }, [initPlayer, saveCurrentTime]);

  return (
    <div
      className={`fixed z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-[#0d1117] transition-all duration-300 ${
        minimised
          ? 'bottom-4 right-4 w-64 h-12'
          : 'bottom-4 right-4 w-80 sm:w-[480px]'
      }`}
      style={{ boxShadow: '0 0 40px rgba(0,0,0,0.7)' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border-b border-white/10">
        <Youtube size={16} className="text-red-400 flex-shrink-0" />
        <span className="flex-1 text-xs text-white font-medium truncate">{title || 'Video'}</span>
        <button
          onClick={() => setMinimised(m => !m)}
          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title={minimised ? 'Restore' : 'Minimise'}
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => { saveCurrentTime(); onClose(); }}
          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Player container — always mounted so video keeps running when minimised */}
      <div className={minimised ? 'hidden' : 'aspect-video'}>
        <div ref={divRef} className="w-full h-full" />
      </div>
    </div>
  );
};

const EnhancedCourseRoom = () => {
  const { enrollmentId } = useParams();
  const { user } = useAuthStore();
  const { toggleBuddy, setCourseContext } = useBuddyStore();
  
  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, notes, todo, gamification, resources
  const [showChapterDrawer, setShowChapterDrawer] = useState(false);
  const [pptFiles, setPptFiles] = useState([]);
  const [videoPlayer, setVideoPlayer] = useState(null); // { url, title } | null

  useEffect(() => {
    loadCourseData();
  }, [enrollmentId]);

  const loadCourseData = async () => {
    try {
      const enrollmentData = await getEnrollment(enrollmentId);
      setEnrollment(enrollmentData);

      const courseData = await getCourse(enrollmentData.courseId);
      setCourse(courseData);

      // Load course PPT/PDF resources
      const files = await getCoursePptFiles(enrollmentData.courseId);
      setPptFiles(files);

      // Load chapters from course content
      if (courseData.chapters && courseData.chapters.length > 0) {
        setChapters(courseData.chapters);
      }

      // Also load AI curriculum if available
      const curriculumData = await getCurriculum(enrollmentId);
      setCurriculum(curriculumData?.curriculum);

      // Update streak
      await updateStreak(user.uid, enrollmentData.courseId);

    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const currentChapter = chapters[currentChapterIndex];
  const currentLesson = currentChapter?.lessons?.[currentLessonIndex];
  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Keep Buddy in sync with whatever lesson the student is currently viewing
  useEffect(() => {
    if (course && currentChapter && currentLesson) {
      setCourseContext({
        courseName: course.title,
        currentChapter: currentChapter.title,
        currentLesson: currentLesson.title,
        currentLessonContent: currentLesson.content
          ? currentLesson.content.slice(0, 1200)
          : null,
        progressPercentage: Math.round(progressPercentage),
      });
    }
  }, [course, currentChapterIndex, currentLessonIndex]);

  const markLessonComplete = async () => {
    try {
      const lessonId = `${currentChapter.id}_${currentLesson.id}`;
      const newCompletedLessons = [...(enrollment.completedLessons || []), lessonId];
      
      await updateEnrollmentProgress(enrollmentId, {
        completedLessons: newCompletedLessons,
        progress: (newCompletedLessons.length / totalLessons) * 100,
      });

      // Award points
      await awardPoints(
        user.uid,
        course.id,
        10,
        'Lesson Completed',
        `Finished: ${currentLesson.title}`
      );

      // Check for first lesson badge
      if (newCompletedLessons.length === 1) {
        await awardBadge(user.uid, course.id, 'first_lesson');
      }

      toast.success('Lesson completed! +10 XP');
      await loadCourseData();
      
      // Move to next lesson
      handleNextLesson();
    } catch (error) {
      toast.error('Failed to mark lesson complete');
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < (currentChapter.lessons?.length || 0) - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      const prevChapter = chapters[currentChapterIndex - 1];
      setCurrentLessonIndex((prevChapter.lessons?.length || 1) - 1);
    }
  };

  const handleStartQuiz = async () => {
    if (!currentChapter.quiz || !currentChapter.quiz.enabled) {
      toast.error('No quiz available for this chapter');
      return;
    }

    setQuizLoading(true);
    try {
      // Use predefined quiz questions from chapter
      if (currentChapter.quiz.questions && currentChapter.quiz.questions.length > 0) {
        setQuiz({ questions: currentChapter.quiz.questions });
        setShowQuiz(true);
      } else {
        // Generate adaptive quiz using AI
        const quizData = await generateAdaptiveQuiz(
          course,
          currentChapter.title,
          enrollment,
          enrollment.quizResults || []
        );
        setQuiz(quizData);
        setShowQuiz(true);
      }
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(quizAnswers).length !== quiz.questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    let correct = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = (correct / quiz.questions.length) * 100;

    try {
      await saveQuizResult(enrollmentId, {
        moduleId: currentChapter?.id || 'unknown',
        chapterId: currentChapter?.id || 'unknown',
        score,
        answers: quizAnswers,
        totalQuestions: quiz.questions.length,
        correctAnswers: correct,
      });

      // Award points based on score
      const pointsEarned = Math.round(score / 2); // 50 points for 100% score
      await awardPoints(
        user.uid,
        course.id,
        pointsEarned,
        'Quiz Completed',
        `Scored ${score.toFixed(0)}% on ${currentChapter.title}`
      );

      // Award badge for perfect score
      if (score === 100) {
        await awardBadge(user.uid, course.id, 'quiz_master');
        toast.success(`Perfect score! +${pointsEarned} XP + Quiz Master Badge! 🧠`);
      } else {
        toast.success(`Quiz completed! Score: ${score.toFixed(0)}% (+${pointsEarned} XP)`);
      }

      setShowQuiz(false);
      setQuizAnswers({});
      await loadCourseData();
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  const isLessonCompleted = (chapterId, lessonId) => {
    const lessonKey = `${chapterId}_${lessonId}`;
    return enrollment?.completedLessons?.includes(lessonKey);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading course...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-3 sm:space-y-6">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <h1 className="text-base sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-2 leading-snug line-clamp-2">{course.title}</h1>
              <p className="text-blue-100 text-xs sm:text-sm truncate">Ch {currentChapterIndex + 1}: {currentChapter?.title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Chapter list toggle — mobile only */}
              <button
                onClick={() => setShowChapterDrawer(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <List size={16} />
                <span className="hidden sm:inline">Chapters</span>
              </button>
              <button
                onClick={toggleBuddy}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Ask Buddy</span>
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Progress</span>
              <span>{completedLessons}/{totalLessons} lessons</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-blue-100">{progressPercentage.toFixed(0)}% Complete</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-1.5 flex gap-1">
              {[
                { id: 'content',       icon: BookOpen, label: 'Content'   },
                { id: 'notes',         icon: FileText,  label: 'Notes'     },
                { id: 'todo',          icon: Target,    label: 'Tasks'     },
                { id: 'gamification',  icon: Award,     label: 'Progress'  },
                { id: 'resources',     icon: Download,  label: 'Resources' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Content Display */}
            {activeTab === 'content' && !showQuiz && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                      Lesson {currentLessonIndex + 1}/{currentChapter?.lessons?.length || 0}
                    </span>
                    {isLessonCompleted(currentChapter.id, currentLesson.id) && (
                      <span className="px-2.5 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Done
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                      {currentLesson?.duration || '30 min'}
                    </span>
                  </div>
                  
                  <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">{currentLesson?.title}</h2>
                  
                  {/* Lesson Type Badge + Watch Video button */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm">
                      {currentLesson?.type === 'video' && <Video size={14} />}
                      {currentLesson?.type === 'document' && <File size={14} />}
                      {currentLesson?.type === 'article' && <FileText size={14} />}
                      <span className="capitalize">{currentLesson?.type} Lesson</span>
                    </div>
                    {currentLesson?.youtubeUrl && (
                      <button
                        onClick={() => setVideoPlayer({ url: currentLesson.youtubeUrl, title: currentLesson.title, lessonId: currentLesson.id })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors border border-red-500/30"
                      >
                        <Youtube size={14} />
                        Watch Video
                      </button>
                    )}
                  </div>
                </div>

                {/* Video Lesson */}
                {currentLesson?.type === 'video' && currentLesson.videoUrl && (
                  <div className="mb-6">
                    {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        controls
                        className="w-full rounded-xl"
                        src={currentLesson.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {/* Document Lesson */}
                {currentLesson?.type === 'document' && currentLesson.documentUrl && (
                  <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Course Materials</h3>
                      <a
                        href={currentLesson.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Download size={18} />
                        Download
                      </a>
                    </div>
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(currentLesson.documentUrl)}&embedded=true`}
                      className="w-full h-[600px] rounded-lg"
                    />
                  </div>
                )}

                {/* Article/Text Content - Presentation Style */}
                {(currentLesson?.type === 'article' || currentLesson?.type === 'interactive') && currentLesson.content && (
                  <div className="mb-6">
                    <PresentationRenderer content={currentLesson.content} />
                  </div>
                )}

                {/* Lesson Navigation */}
                <div className="pt-4 sm:pt-6 border-t border-white/10 space-y-3">
                  {/* Action buttons row */}
                  <div className="flex gap-2">
                    {!isLessonCompleted(currentChapter.id, currentLesson.id) && (
                      <button
                        onClick={markLessonComplete}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition-transform text-sm font-medium"
                      >
                        <CheckCircle size={16} />
                        <span>Mark Complete</span>
                      </button>
                    )}
                    {currentLessonIndex === (currentChapter?.lessons?.length || 1) - 1 && currentChapter?.quiz?.enabled && (
                      <button
                        onClick={handleStartQuiz}
                        disabled={quizLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 text-sm font-medium"
                      >
                        <Brain size={16} />
                        <span>{quizLoading ? 'Loading...' : 'Take Quiz'}</span>
                      </button>
                    )}
                  </div>
                  {/* Prev / Next row */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousLesson}
                      disabled={currentChapterIndex === 0 && currentLessonIndex === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>
                    <button
                      onClick={handleNextLesson}
                      disabled={currentChapterIndex === chapters.length - 1 && currentLessonIndex === (currentChapter?.lessons?.length || 1) - 1}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Interface */}
            {activeTab === 'content' && showQuiz && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Chapter Quiz</h2>
                <div className="space-y-6">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <p className="font-semibold text-white mb-4 text-lg">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optIndex}
                              checked={quizAnswers[question.id] === optIndex}
                              onChange={() => handleQuizAnswer(question.id, optIndex)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <StudentNotes
                courseId={course.id}
                chapterId={currentChapter?.id}
                lessonId={currentLesson?.id}
              />
            )}

            {/* Todo Tab */}
            {activeTab === 'todo' && (
              <StudentTodoList courseId={course.id} />
            )}

            {/* Gamification Tab */}
            {activeTab === 'gamification' && (
              <Gamification courseId={course.id} enrollmentId={enrollmentId} />
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Download size={20} className="text-orange-400" />
                  Course Materials
                </h2>
                {pptFiles.length === 0 ? (
                  <p className="text-gray-400 text-sm">No resources have been uploaded for this course yet.</p>
                ) : (
                  <div className="space-y-3">
                    {pptFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                        <FileText size={18} className="text-orange-400 flex-shrink-0" />
                        <span className="flex-1 text-sm text-white truncate">{file.name}</span>
                        <a
                          href={`data:${file.fileType};base64,${file.data}`}
                          download={file.name}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
                        >
                          <Download size={14} />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

      {/* Floating Video Player */}
      {videoPlayer && (
        <FloatingVideoPlayer
          url={videoPlayer.url}
          title={videoPlayer.title}
          lessonId={videoPlayer.lessonId}
          userId={user?.uid}
          onClose={() => setVideoPlayer(null)}
        />
      )}
          </div>

          {/* Sidebar — desktop only; mobile uses bottom drawer */}
          <div className="hidden lg:block space-y-4">
            <CourseContentSidebar
              chapters={chapters}
              currentChapterIndex={currentChapterIndex}
              currentLessonIndex={currentLessonIndex}
              isLessonCompleted={isLessonCompleted}
              onSelectChapter={(ci) => { setCurrentChapterIndex(ci); setCurrentLessonIndex(0); }}
              onSelectLesson={(li) => setCurrentLessonIndex(li)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Chapter Drawer ─────────────────────────────────────────── */}
      {showChapterDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowChapterDrawer(false)} />
          <div className="relative w-full bg-[#0d1117] border border-white/10 rounded-t-3xl max-h-[80dvh] overflow-hidden flex flex-col z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="font-semibold text-white text-base">Course Content</h3>
              <button onClick={() => setShowChapterDrawer(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <CourseContentSidebar
                chapters={chapters}
                currentChapterIndex={currentChapterIndex}
                currentLessonIndex={currentLessonIndex}
                isLessonCompleted={isLessonCompleted}
                onSelectChapter={(ci) => { setCurrentChapterIndex(ci); setCurrentLessonIndex(0); setShowChapterDrawer(false); }}
                onSelectLesson={(li) => { setCurrentLessonIndex(li); setShowChapterDrawer(false); }}
              />
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

// ── Reusable chapter/lesson sidebar ─────────────────────────────────────────
const CourseContentSidebar = ({
  chapters, currentChapterIndex, currentLessonIndex, isLessonCompleted,
  onSelectChapter, onSelectLesson
}) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 sm:p-6">
    <h3 className="font-semibold text-sm sm:text-lg mb-3 sm:mb-4 text-white">Course Content</h3>
    <div className="space-y-2 sm:space-y-3 max-h-[60dvh] lg:max-h-[600px] overflow-y-auto pr-1">
      {chapters.map((chapter, chIndex) => (
        <div key={chapter.id} className="space-y-1.5">
          <div
            className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-colors ${
              chIndex === currentChapterIndex
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => onSelectChapter(chIndex)}
          >
            <p className="font-medium text-white text-xs sm:text-sm">
              Ch {chIndex + 1}: {chapter.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{chapter.lessons?.length || 0} lessons</p>
          </div>
          {chIndex === currentChapterIndex && (
            <div className="ml-3 sm:ml-4 space-y-1 sm:space-y-2">
              {chapter.lessons?.map((lesson, lIndex) => {
                const completed = isLessonCompleted(chapter.id, lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lIndex)}
                    className={`p-1.5 sm:p-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors ${
                      lIndex === currentLessonIndex
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm text-white leading-snug">{lesson.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default EnhancedCourseRoom;
