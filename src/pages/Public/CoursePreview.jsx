import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, BookOpen, CheckCircle, Users, Award, Target,
  PlayCircle, FileText, Brain, Sparkles, TrendingUp, ArrowLeft,
  Star, BarChart3, ChevronRight, ChevronDown, GraduationCap,
  Zap, Network, Shield, ArrowRight, Cpu, Layers3, Loader,
  BadgeCheck, Flame, PlusCircle, BarChart2,
} from 'lucide-react';
import { getPublishedCourses, getCourse } from '../../services/firestoreService';

// ─── Category / level config (mirrors Landing.jsx) ───────────────────────────
const levelConfig = {
  beginner:     { label: 'Beginner',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', bar: 'from-emerald-500 to-teal-500' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',     bar: 'from-amber-500 to-orange-500' },
  advanced:     { label: 'Advanced',     color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',         bar: 'from-rose-500 to-pink-600' },
};

const categoryMeta = {
  'AI & Machine Learning': {
    icon: Cpu,
    topBar: 'from-violet-500 to-blue-500',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    glow: 'shadow-violet-500/20',
    heroGradient: 'from-violet-900/60 via-[#020817] to-[#020817]',
    accent: 'violet',
    accentColor: '#7c3aed',
  },
  'AI for Professionals': {
    icon: Layers3,
    topBar: 'from-cyan-500 to-teal-400',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    heroGradient: 'from-cyan-900/60 via-[#020817] to-[#020817]',
    accent: 'cyan',
    accentColor: '#0891b2',
  },
};

const defaultMeta = {
  icon: BookOpen,
  topBar: 'from-blue-500 to-indigo-500',
  badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  glow: 'shadow-blue-500/20',
  heroGradient: 'from-blue-900/60 via-[#020817] to-[#020817]',
  accent: 'blue',
  accentColor: '#2563eb',
};

// ─── Related category suggestions ────────────────────────────────────────────
const addOnMap = {
  'AI & Machine Learning': ['AI for Professionals'],
  'AI for Professionals':  ['AI & Machine Learning'],
};

// ─── Benefit items (static, always shown) ────────────────────────────────────
const platformBenefits = [
  { icon: Sparkles,   text: 'AI-Personalized Learning Path',   color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  { icon: Brain,      text: 'Adaptive Quizzes',                color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  { icon: Award,      text: 'Certificate of Completion',       color: 'text-pink-400',    bg: 'bg-pink-500/10'    },
  { icon: TrendingUp, text: 'Progress & Analytics Dashboard',  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Star,       text: '24 / 7 AI Buddy Tutor',           color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  { icon: Zap,        text: 'XP, Badges & Streaks',            color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { icon: Network,    text: 'Integrated Course Room',          color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  { icon: BadgeCheck, text: 'Self-Paced, No Deadlines',        color: 'text-teal-400',    bg: 'bg-teal-500/10'    },
];

// ─── Small course card used in "Popular" and "Add-Ons" sections ──────────────
const MiniCourseCard = ({ course, label }) => {
  const meta = categoryMeta[course.category] || defaultMeta;
  const lvl = levelConfig[course.level] || levelConfig.beginner;
  const CatIcon = meta.icon;
  const iconText = meta.badge.split(' ').find(c => c.startsWith('text-'));
  const chapterCount = course.chapters?.length || 0;

  return (
    <Link
      to={`/courses/${course.id}`}
      className={`group relative flex flex-col bg-[#0d1117] border border-white/6 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${meta.glow}`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${meta.topBar}`} />
      {label && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full border bg-white/8 text-white/70 border-white/15 uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-white/5">
            <CatIcon size={13} className={iconText} />
          </div>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border tracking-wide uppercase ${meta.badge}`}>
            {course.category === 'AI & Machine Learning' ? 'AI & ML' : 'Professionals'}
          </span>
          <span className={`ml-auto px-2.5 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${lvl.color}`}>
            {lvl.label}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <BookOpen size={12} className="text-blue-500" />
            {chapterCount} ch
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-violet-500" />
            {course.enrolledStudents || 0}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-amber-500" />
              {course.duration}w
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CoursePreview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, published] = await Promise.all([
          getCourse(courseId),
          getPublishedCourses(),
        ]);
        setCourse(courseData);
        setAllCourses(published);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [courseId]);

  const toggleChapter = (idx) =>
    setExpandedChapters(prev => ({ ...prev, [idx]: !prev[idx] }));

  // ── Derived data ─────────────────────────────────────────────────────────
  const meta   = course ? (categoryMeta[course.category] || defaultMeta) : defaultMeta;
  const lvl    = course ? (levelConfig[course.level] || levelConfig.beginner) : levelConfig.beginner;

  // Popular: other courses sorted by enrolment, max 4
  const popularCourses = allCourses
    .filter(c => c.id !== courseId)
    .sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
    .slice(0, 4);

  // Add-ons: courses from complementary/related categories, max 4
  const addOnCategories = course ? (addOnMap[course.category] || []) : [];
  const addOnCourses = allCourses
    .filter(c => c.id !== courseId && (
      addOnCategories.includes(c.category) ||
      (addOnCategories.length === 0 && c.category === course?.category)
    ))
    .sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
    .slice(0, 4);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col">
        <PublicNav />
        <div className="flex flex-col items-center justify-center flex-1 py-20">
          <Loader className="animate-spin text-blue-500 mb-4" size={42} />
          <p className="text-gray-500 text-sm">Loading course details…</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col">
        <PublicNav />
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center px-4">
          <FileText className="text-gray-600 mb-4" size={56} />
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">This course doesn't exist or has been removed.</p>
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-semibold text-white text-sm hover:scale-105 transition-transform">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const chapterCount = course.chapters?.length || 0;
  const lessonCount  = course.chapters?.reduce((s, ch) => s + (ch.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden">

      {/* ── Global background ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: `${meta.accentColor}14` }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/6 blur-[100px]" />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <PublicNav />

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative pt-10 pb-0">
          {/* Gradient wash behind hero */}
          <div className={`absolute inset-0 bg-gradient-to-b ${meta.heroGradient} pointer-events-none`} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-8 text-sm"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Left: title + meta */}
              <div className="lg:col-span-2">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  <span className={`px-3.5 py-1.5 text-sm font-bold rounded-full border uppercase tracking-wide ${lvl.color}`}>
                    {lvl.label}
                  </span>
                  {course.category && (
                    <span className={`px-3.5 py-1.5 text-sm font-bold rounded-full border ${meta.badge}`}>
                      {course.category}
                    </span>
                  )}
                  {course.chapters?.length > 0 && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/15 text-emerald-300 text-sm font-bold rounded-full border border-emerald-500/30">
                      <CheckCircle size={13} />
                      Structured Content
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-5">
                  {course.title}
                </h1>
                <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-7 max-w-2xl">
                  {course.description}
                </p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { icon: Clock,     label: `${course.duration} weeks`,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
                    { icon: BookOpen,  label: `${chapterCount} chapters`,   color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20'    },
                    { icon: BarChart2, label: `${lessonCount} lessons`,     color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
                    { icon: Users,     label: `${course.enrolledStudents || 0} enrolled`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${bg} ${color}`}>
                      <Icon size={14} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA card — desktop sticky */}
              <div className="hidden lg:block">
                <EnrollCTA course={course} meta={meta} />
              </div>
            </div>
          </div>
          {/* Separator */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN BODY
        ══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mobile CTA */}
          <div className="lg:hidden mb-8">
            <EnrollCTA course={course} meta={meta} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Main column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* What You'll Learn */}
              {course.objectives?.length > 0 && (
                <ContentBlock
                  icon={Target}
                  title="What You'll Learn"
                  gradient="from-blue-600 to-violet-600"
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.objectives.map((obj, i) => (
                      <div key={i} className="flex gap-3 items-start p-4 bg-white/3 rounded-xl border border-white/6">
                        <div className="flex-shrink-0 mt-0.5 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={13} className="text-white" />
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed">{obj}</p>
                      </div>
                    ))}
                  </div>
                </ContentBlock>
              )}

              {/* Topics Covered */}
              {course.topics?.length > 0 && (
                <ContentBlock
                  icon={Brain}
                  title="Topics Covered"
                  gradient="from-violet-600 to-pink-600"
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.topics.map((topic, i) => (
                      <div key={i} className="flex gap-3 items-center p-4 bg-white/3 rounded-xl border border-white/6">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                          {i + 1}
                        </div>
                        <p className="text-gray-300 text-base">{topic}</p>
                      </div>
                    ))}
                  </div>
                </ContentBlock>
              )}

              {/* Course Curriculum */}
              {course.chapters?.length > 0 && (
                <ContentBlock
                  icon={BookOpen}
                  title="Course Curriculum"
                  gradient="from-indigo-600 to-blue-600"
                  subtitle={`${chapterCount} chapters · ${lessonCount} lessons`}
                >
                  <div className="space-y-2">
                    {course.chapters.map((chapter, idx) => (
                      <div key={chapter.id || idx} className="bg-white/3 border border-white/6 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleChapter(idx)}
                          className="w-full flex items-center gap-4 p-5 hover:bg-white/4 transition-colors text-left"
                        >
                          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-white leading-snug truncate">{chapter.title}</h3>
                            <p className="text-gray-500 text-sm mt-0.5">
                              {chapter.lessons?.length || 0} lessons
                              {chapter.quiz?.enabled ? ' · Quiz' : ''}
                              {chapter.assignment?.enabled ? ' · Assignment' : ''}
                            </p>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`flex-shrink-0 text-gray-500 transition-transform ${expandedChapters[idx] ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {expandedChapters[idx] && chapter.lessons?.length > 0 && (
                          <div className="border-t border-white/5 px-5 pb-4 pt-3">
                            {chapter.description && (
                              <p className="text-gray-500 text-sm mb-3 leading-relaxed">{chapter.description}</p>
                            )}
                            <ul className="space-y-1.5">
                              {chapter.lessons.map((lesson, li) => (
                                <li key={li} className="flex items-center gap-2.5 text-sm text-gray-400 py-1.5 border-b border-white/4 last:border-0">
                                  <PlayCircle size={13} className="text-blue-400 flex-shrink-0" />
                                  <span className="truncate">{lesson.title}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {chapter.quiz?.enabled && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/15 text-violet-300 text-xs font-medium rounded-full border border-violet-500/20">
                                  <Brain size={11} /> Quiz included
                                </span>
                              )}
                              {chapter.assignment?.enabled && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-pink-500/15 text-pink-300 text-xs font-medium rounded-full border border-pink-500/20">
                                  <FileText size={11} /> Assignment
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ContentBlock>
              )}

              {/* Prerequisites / Requirements */}
              {course.prerequisites?.length > 0 && (
                <ContentBlock
                  icon={BarChart3}
                  title="Requirements"
                  gradient="from-orange-500 to-red-500"
                >
                  <ul className="space-y-3">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="flex-shrink-0 text-orange-400 mt-0.5" size={17} />
                        <span className="text-gray-300 text-base">{p}</span>
                      </li>
                    ))}
                  </ul>
                </ContentBlock>
              )}
            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <div className="hidden lg:block space-y-5">
              {/* Platform benefits */}
              <BenefitsCard />

              {/* Course quick-facts */}
              <div className="bg-[#0d1117] border border-white/8 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Course Details</h3>
                {[
                  ['Level',    <span key="level" className="capitalize">{course.level}</span>],
                  ['Duration', `${course.duration} weeks`],
                  ['Chapters', chapterCount],
                  ['Lessons',  lessonCount],
                  ['Students', course.enrolledStudents || 0],
                  ['Category', course.category],
                ].filter(([, v]) => v !== undefined && v !== '' && v !== 0 || v === 0).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile: benefits strip ────────────────────────────────────── */}
          <div className="lg:hidden mt-6">
            <BenefitsCard />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CURRENTLY BEING STUDIED (popular courses)
        ══════════════════════════════════════════════════════════════════ */}
        {popularCourses.length > 0 && (
          <section className="border-t border-white/6 py-14" style={{ background: 'linear-gradient(180deg, #060b18 0%, #040910 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-orange-500/15">
                  <Flame size={18} className="text-orange-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Students Are Currently Studying</h2>
              </div>
              <p className="text-gray-400 text-base mb-8 ml-12">
                The most popular courses on iVersity right now — join thousands of learners.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {popularCourses.map((c, i) => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    label={i === 0 ? '🔥 Top Pick' : i === 1 ? 'Trending' : null}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RECOMMENDED ADD-ONS
        ══════════════════════════════════════════════════════════════════ */}
        {addOnCourses.length > 0 && (
          <section className="border-t border-white/6 py-14" style={{ background: 'linear-gradient(180deg, #040910 0%, #020817 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/15">
                  <PlusCircle size={18} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Great Add-On Courses</h2>
              </div>
              <p className="text-gray-400 text-base mb-8 ml-12">
                Pair <span className="text-white font-medium">"{course.title}"</span> with these courses for a more complete skill set.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {addOnCourses.map(c => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    label="Add-On"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM CTA BANNER
        ══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-white/6 py-16 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0618 0%, #060c1a 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-700/8 blur-[80px]" />
          </div>
          <div className="relative max-w-2xl mx-auto text-center px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <GraduationCap size={13} className="text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">Free Enrollment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Ready to Start Learning{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {course.title}?
              </span>
            </h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              Create your free account and get instant access to this course plus AI-powered tools designed to make you succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/register?course=${courseId}`}
                className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-sm hover:from-blue-500 hover:to-violet-500 transition-all shadow-xl shadow-blue-600/25 flex items-center gap-2 hover:scale-[1.03]"
              >
                Enroll Now — It's Free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white/4 border border-white/10 rounded-xl font-semibold text-sm hover:bg-white/8 transition-all text-gray-300"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile sticky bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#020817]/95 backdrop-blur-xl border-t border-white/8">
          <Link
            to={`/register?course=${courseId}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
          >
            Enroll Now — It's Free
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="h-16 lg:hidden" /> {/* spacer above sticky bar */}
      </div>
    </div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const PublicNav = () => (
  <nav className="relative z-50 border-b border-white/5 bg-[#020817]/80 backdrop-blur-xl sticky top-0">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 blur opacity-25" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-white">i</span>
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Versity</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium hidden sm:block">
          Sign In
        </Link>
        <Link
          to="/register"
          className="group px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/25 flex items-center gap-1.5"
        >
          Get Started
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  </nav>
);

const EnrollCTA = ({ course, meta }) => (
  <div className={`bg-[#0d1117] border border-white/10 hover:border-white/15 rounded-2xl overflow-hidden shadow-xl ${meta.glow} transition-all duration-300`}>
    <div className={`h-1 bg-gradient-to-r ${meta.topBar}`} />
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">Enrollment</p>
          <p className="text-3xl font-extrabold text-white">Free</p>
        </div>
        <div className="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-300 text-sm font-bold rounded-full border border-emerald-500/25">
          ✓ Open
        </div>
      </div>

      <Link
        to={`/register?course=${course.id}`}
        className="group flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-base hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] mb-3"
      >
        Enroll Now — It's Free
        <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
      <Link
        to="/login"
        className="flex items-center justify-center w-full py-3 bg-white/4 border border-white/8 rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium"
      >
        Already enrolled? Sign in
      </Link>

      <div className="mt-6 pt-5 border-t border-white/6 space-y-3">
        {[
          { icon: CheckCircle, text: 'Full lifetime access', color: 'text-emerald-400' },
          { icon: Sparkles,    text: 'AI-personalized curriculum', color: 'text-blue-400' },
          { icon: Award,       text: 'Certificate on completion', color: 'text-amber-400' },
          { icon: Shield,      text: 'No credit card required', color: 'text-violet-400' },
        ].map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
            <Icon size={15} className={`flex-shrink-0 ${color}`} />
            {text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContentBlock = ({ icon: Icon, title, gradient, subtitle, children }) => (
  <div className="bg-[#0d1117] border border-white/6 rounded-2xl p-6 sm:p-7">
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-3 bg-gradient-to-r ${gradient} rounded-xl flex-shrink-0 shadow-md`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const BenefitsCard = () => (
  <div className="bg-[#0d1117] border border-white/8 rounded-2xl p-6">
    <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
      <BadgeCheck size={17} className="text-blue-400" />
      What's Included
    </h3>
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
      {platformBenefits.map(({ icon: Icon, text, color, bg }) => (
        <div key={text} className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
            <Icon size={15} className={color} />
          </div>
          <span className="text-gray-400 text-sm leading-snug">{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CoursePreview;
