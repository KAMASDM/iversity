import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BookOpen, Users, Award, Bot, TrendingUp, Clock, Sparkles, Zap,
  GraduationCap, ArrowRight, CheckCircle, BarChart2,
  Brain, Code2, Network, Shield, ChevronRight, Star, Cpu, Layers3, Filter,
} from 'lucide-react';
import { getPublishedCourses } from '../services/firestoreService';

// ─── Category & level config ──────────────────────────────────────────────────
const levelConfig = {
  beginner:     { label: 'Beginner',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  advanced:     { label: 'Advanced',     color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
};

const categoryMeta = {
  'AI & Machine Learning': {
    icon: Cpu,
    topBar: 'from-violet-500 to-blue-500',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    glow: 'hover:shadow-violet-500/20',
    border: 'hover:border-violet-500/40',
    btnHover: 'hover:bg-violet-600/80 hover:border-violet-500/0',
    sectionBg: 'bg-violet-500/5 border-violet-500/20',
    sectionIcon: 'bg-violet-500/15',
    sectionText: 'text-violet-400',
    desc: 'Core technical skills in AI, LLMs, RAG, and agent development',
  },
  'AI for Professionals': {
    icon: Layers3,
    topBar: 'from-cyan-500 to-teal-400',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glow: 'hover:shadow-cyan-500/20',
    border: 'hover:border-cyan-500/40',
    btnHover: 'hover:bg-cyan-600/80 hover:border-cyan-500/0',
    sectionBg: 'bg-cyan-500/5 border-cyan-500/20',
    sectionIcon: 'bg-cyan-500/15',
    sectionText: 'text-cyan-400',
    desc: 'Industry-specific AI skills for healthcare, legal, marketing & more',
  },
};

const defaultMeta = {
  icon: BookOpen,
  topBar: 'from-blue-500 to-indigo-500',
  badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  glow: 'hover:shadow-blue-500/20',
  border: 'hover:border-blue-500/40',
  btnHover: 'hover:bg-blue-600/80 hover:border-blue-500/0',
};

// ─── Section Divider ──────────────────────────────────────────────────────────
const SectionDivider = ({ label, color = 'blue' }) => {
  const colors = {
    blue:   'text-blue-400 border-blue-500/30 bg-blue-500/10',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    cyan:   'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    pink:   'text-pink-400 border-pink-500/30 bg-pink-500/10',
  };
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className={`px-4 py-1 rounded-full text-xs font-mono font-bold border tracking-widest uppercase ${colors[color]}`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, accent }) => {
  const accents = {
    blue:    { border: 'border-blue-500/20 hover:border-blue-500/50',   icon: 'bg-blue-500/15 text-blue-400',   bar: 'bg-blue-500',   glow: 'hover:shadow-blue-500/15'   },
    violet:  { border: 'border-violet-500/20 hover:border-violet-500/50', icon: 'bg-violet-500/15 text-violet-400', bar: 'bg-violet-500', glow: 'hover:shadow-violet-500/15' },
    cyan:    { border: 'border-cyan-500/20 hover:border-cyan-500/50',   icon: 'bg-cyan-500/15 text-cyan-400',   bar: 'bg-cyan-500',   glow: 'hover:shadow-cyan-500/15'   },
    pink:    { border: 'border-pink-500/20 hover:border-pink-500/50',   icon: 'bg-pink-500/15 text-pink-400',   bar: 'bg-pink-500',   glow: 'hover:shadow-pink-500/15'   },
    emerald: { border: 'border-emerald-500/20 hover:border-emerald-500/50', icon: 'bg-emerald-500/15 text-emerald-400', bar: 'bg-emerald-500', glow: 'hover:shadow-emerald-500/15' },
    indigo:  { border: 'border-indigo-500/20 hover:border-indigo-500/50', icon: 'bg-indigo-500/15 text-indigo-400', bar: 'bg-indigo-500', glow: 'hover:shadow-indigo-500/15' },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`group relative bg-[#0d1117] border ${a.border} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${a.glow} overflow-hidden`}>
      <div className={`absolute left-0 top-4 bottom-4 w-[3px] ${a.bar} rounded-full opacity-50 group-hover:opacity-100 group-hover:top-2 group-hover:bottom-2 transition-all duration-300`} />
      <div className={`inline-flex p-3 rounded-xl ${a.icon} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course }) => {
  const meta = categoryMeta[course.category] || defaultMeta;
  const lvl = levelConfig[course.level] || levelConfig.beginner;
  const chapterCount = course.chapters?.length || 0;
  const lessonCount  = course.chapters?.reduce((s, ch) => s + (ch.lessons?.length || 0), 0) || 0;
  const CatIcon = meta.icon;
  const iconTextClass = meta.badge.split(' ').find(c => c.startsWith('text-'));

  return (
    <div className={`group relative flex flex-col bg-[#0d1117] border border-white/6 ${meta.border} rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${meta.glow}`}>
      <div className={`h-1 w-full bg-gradient-to-r ${meta.topBar}`} />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <CatIcon size={15} className={iconTextClass} />
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border tracking-wide uppercase ${meta.badge}`}>
              {course.category === 'AI & Machine Learning' ? 'AI & ML' : 'Professionals'}
            </span>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${lvl.color}`}>
            {lvl.label}
          </span>
        </div>
        <h3 className="text-base font-bold text-white mb-2.5 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {course.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 pt-4 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-blue-500" />
            {chapterCount} chapters
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart2 size={13} className="text-violet-500" />
            {lessonCount} lessons
          </span>
          {course.duration && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-amber-500" />
              {course.duration}w
            </span>
          )}
        </div>
        <div className="flex gap-2.5">
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            View Details
          </Link>
          <Link
            to={`/register?course=${course.id}`}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-white/5 border border-white/10 ${meta.btnHover} text-white font-semibold rounded-xl transition-all duration-200 text-sm group/btn`}
          >
            Enroll
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Category Tab ─────────────────────────────────────────────────────────────
const CategoryTab = ({ label, active, count, color, onClick }) => {
  const colors = {
    blue:   { active: 'bg-blue-600 border-blue-500 text-white shadow-blue-600/30',   inactive: 'border-white/10 text-gray-400 hover:border-blue-500/40 hover:text-white'   },
    violet: { active: 'bg-violet-600 border-violet-500 text-white shadow-violet-600/30', inactive: 'border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-white' },
    cyan:   { active: 'bg-cyan-600 border-cyan-500 text-white shadow-cyan-600/30',   inactive: 'border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-white'   },
  };
  const c = colors[color] || colors.blue;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
        active ? `${c.active} shadow-lg` : `bg-white/3 ${c.inactive}`
      }`}
    >
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
        active ? 'bg-white/20' : 'bg-white/8 text-gray-500'
      }`}>{count}</span>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    getPublishedCourses()
      .then(d => setCourses(d))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  const categoryCounts = {
    all: courses.length,
    'AI & Machine Learning': courses.filter(c => c.category === 'AI & Machine Learning').length,
    'AI for Professionals':  courses.filter(c => c.category === 'AI for Professionals').length,
  };

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-hidden">

      {/* ── Global background ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-blue-700/8 blur-[140px]" />
        <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-700/6 blur-[100px]" />
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="relative z-50 border-b border-white/5 bg-[#020817]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
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
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link
              to="/register"
              className="group px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/25 flex items-center gap-1.5"
            >
              Get Started
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs text-blue-300 font-medium tracking-wide">AI-Powered Learning Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
                <span className="block text-white">Master AI</span>
                <span className="block text-white">Before AI</span>
                <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Masters You
                </span>
              </h1>

              <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
                Immersive, AI-personalized courses on LLMs, Prompt Engineering, RAG, and LangChain —
                taught by AI, guided by AI, certified by AI.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-base hover:from-blue-500 hover:to-violet-500 transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.03]"
                >
                  Start Learning Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/10 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                {['No credit card', 'Free forever plan', 'Cancel anytime'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: AI visual card */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Pulse rings */}
              <div className="absolute w-80 h-80 rounded-full border border-blue-500/10 animate-pulse" />
              <div className="absolute w-96 h-96 rounded-full border border-violet-500/8" />
              <div className="absolute w-[28rem] h-[28rem] rounded-full border border-blue-500/5" />

              {/* Central card */}
              <div className="relative w-72 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-blue-900/40 animate-float">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">buddy.ai</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="text-gray-500">{'>'} Loading knowledge base…</div>
                  <div className="text-green-400">✓ 135 course chunks indexed</div>
                  <div className="text-gray-500">{'>'} Student query detected</div>
                  <div className="text-blue-300">? What is RAG architecture?</div>
                  <div className="text-gray-400 leading-relaxed">
                    RAG combines a retrieval system with a generator model — it fetches relevant context before generating a response…
                  </div>
                  <div className="flex items-center gap-1 text-violet-400">
                    <span>Confidence: 94%</span>
                    <span className="animate-blink">▊</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-blue-600/90 backdrop-blur border border-blue-400/30 rounded-xl px-3 py-2 text-xs font-semibold shadow-lg shadow-blue-600/30 animate-float" style={{ animationDelay: '1s' }}>
                <span className="flex items-center gap-1.5"><Brain size={12} /> AI Personalized</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-violet-600/90 backdrop-blur border border-violet-400/30 rounded-xl px-3 py-2 text-xs font-semibold shadow-lg shadow-violet-600/30 animate-float" style={{ animationDelay: '2s' }}>
                <span className="flex items-center gap-1.5"><Shield size={12} /> Certified</span>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8 shadow-xl">
            {[
              { val: '10K+', label: 'Active Learners', color: 'text-blue-400'   },
              { val: '10',   label: 'AI Courses',      color: 'text-violet-400' },
              { val: '98%',  label: 'Completion Rate', color: 'text-cyan-400'   },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-[#0d1117]/80 backdrop-blur px-8 py-6 text-center">
                <div className={`text-4xl font-extrabold tabular-nums mb-1 ${color}`}>{val}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COURSES — distinct background for contrast
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #060c1a 100%)' }}>
        {/* Top border glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-900/10 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-800/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// Curriculum" color="violet" />

          <div className="text-center mt-8 mb-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-white">Courses Built for the</span>{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI Era</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From AI foundations to production-ready agents — choose your path and start learning today.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs mr-1">
              <Filter size={12} />
              <span>Filter:</span>
            </div>
            <CategoryTab
              label="All Courses"
              active={activeCategory === 'all'}
              count={categoryCounts.all}
              color="blue"
              onClick={() => setActiveCategory('all')}
            />
            <CategoryTab
              label="AI & Machine Learning"
              active={activeCategory === 'AI & Machine Learning'}
              count={categoryCounts['AI & Machine Learning']}
              color="violet"
              onClick={() => setActiveCategory('AI & Machine Learning')}
            />
            <CategoryTab
              label="AI for Professionals"
              active={activeCategory === 'AI for Professionals'}
              count={categoryCounts['AI for Professionals']}
              color="cyan"
              onClick={() => setActiveCategory('AI for Professionals')}
            />
          </div>

          {/* Active category info banner */}
          {activeCategory !== 'all' && (() => {
            const meta = categoryMeta[activeCategory];
            const CatIcon = meta.icon;
            return (
              <div className={`flex items-center gap-3 mb-8 p-4 rounded-2xl border ${meta.sectionBg}`}>
                <div className={`p-2 rounded-lg ${meta.sectionIcon}`}>
                  <CatIcon size={18} className={meta.sectionText} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{activeCategory}</p>
                  <p className="text-gray-500 text-xs">{meta.desc}</p>
                </div>
              </div>
            );
          })()}

          {/* Loading skeletons */}
          {coursesLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#0d1117] border border-white/6 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-[3px] bg-white/10" />
                  <div className="p-5 space-y-3">
                    <div className="flex gap-2"><div className="h-5 w-20 bg-white/8 rounded-full" /><div className="h-5 w-16 bg-white/8 rounded-full" /></div>
                    <div className="h-5 bg-white/8 rounded w-4/5" />
                    <div className="space-y-1.5">
                      <div className="h-3 bg-white/5 rounded" /><div className="h-3 bg-white/5 rounded w-5/6" /><div className="h-3 bg-white/5 rounded w-3/4" />
                    </div>
                    <div className="h-8 bg-white/8 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All courses: grouped by category */}
          {!coursesLoading && courses.length > 0 && activeCategory === 'all' && (
            <div className="space-y-14">
              {Object.keys(categoryMeta).map(cat => {
                const catCourses = courses.filter(c => c.category === cat);
                if (catCourses.length === 0) return null;
                const meta = categoryMeta[cat];
                const CatIcon = meta.icon;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${meta.sectionIcon}`}>
                        <CatIcon size={16} className={meta.sectionText} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base leading-tight">{cat}</h3>
                        <p className="text-gray-600 text-xs">{catCourses.length} course{catCourses.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent ml-2" />
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        View all <ChevronRight size={12} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filtered courses */}
          {!coursesLoading && courses.length > 0 && activeCategory !== 'all' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {!coursesLoading && courses.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
              <p>Courses are being prepared. Check back soon!</p>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — dot-grid background, left-bar cards
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24" style={{ background: 'linear-gradient(180deg, #030712 0%, #04091a 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionDivider label="// Features" color="blue" />

          <div className="text-center mt-8 mb-14">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Every Tool You Need to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI-native platform adapts to how you learn, not the other way around.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={Brain}      title="AI-Personalized Curriculum"    desc="On enrollment, AI generates a custom learning plan based on your background, pace, and goals."          accent="blue"    />
            <FeatureCard icon={Bot}        title="Virtual Buddy"                 desc="Ask anything, anytime. Your AI buddy retrieves answers from your course content with zero API latency."  accent="violet"  />
            <FeatureCard icon={TrendingUp} title="Adaptive Quizzes"              desc="Quizzes that dynamically adjust difficulty based on your recent performance and mastery gaps."           accent="cyan"    />
            <FeatureCard icon={Zap}        title="XP & Gamification"             desc="Earn XP, unlock badges, maintain streaks. Learning feels like leveling up in a game."                   accent="pink"    />
            <FeatureCard icon={Award}      title="AI-Graded Certificates"        desc="Final exams evaluated by AI — with a full score breakdown, strengths, and improvement areas."           accent="emerald" />
            <FeatureCard icon={Network}    title="Course Room"                   desc="Slides, notes, to-do tasks, and progress tracking in one focused, distraction-free environment."         accent="indigo"  />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — diagonal stripe + circle accents
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #060c1a 0%, #0a0618 50%, #060c1a 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #818cf8 0px, #818cf8 1px, transparent 0px, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-violet-500/8 pointer-events-none" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-500/8 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionDivider label="// How It Works" color="violet" />

          <div className="text-center mt-8 mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Three Steps to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Mastery</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-pink-500/40" />

            {[
              { step: '01', color: 'blue',   icon: Code2,  title: 'Enroll & Personalize', desc: 'Answer a short questionnaire. AI instantly maps a learning path tailored to your level and goals.' },
              { step: '02', color: 'violet', icon: Brain,  title: 'Learn Interactively',  desc: 'Study structured lessons with live examples, chapter quizzes, notes, and your AI Buddy.' },
              { step: '03', color: 'pink',   icon: Award,  title: 'Get Certified',         desc: 'Pass the AI-evaluated final exam, receive your certificate, and add it to your portfolio.' },
            ].map(({ step, color, icon: Icon, title, desc }) => {
              const c = {
                blue:   { ring: 'border-blue-500/30 bg-blue-500/8',     icon: 'text-blue-400',   badge: 'bg-blue-500/15 text-blue-300'     },
                violet: { ring: 'border-violet-500/30 bg-violet-500/8', icon: 'text-violet-400', badge: 'bg-violet-500/15 text-violet-300' },
                pink:   { ring: 'border-pink-500/30 bg-pink-500/8',     icon: 'text-pink-400',   badge: 'bg-pink-500/15 text-pink-300'     },
              }[color];
              return (
                <div key={step} className="flex flex-col items-center text-center relative">
                  <div className="relative mb-6 z-10">
                    <div className={`w-20 h-20 rounded-2xl border ${c.ring} flex items-center justify-center shadow-lg`}>
                      <Icon size={30} className={c.icon} />
                    </div>
                    <span className={`absolute -top-2 -right-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-lg ${c.badge}`}>{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS — warm dark with per-card color accents
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24" style={{ background: 'linear-gradient(180deg, #03070f 0%, #050510 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-violet-900/6 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// Learners Say" color="pink" />

          <div className="text-center mt-8 mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Loved by{' '}
              <span className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent">10,000+ learners</span>
            </h2>
            <p className="text-gray-500 text-base">Real results from real people building real skills.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Alex M.',  role: 'ML Engineer',        text: 'The AI Buddy actually understands course context. It answered my RAG questions with specific examples from the lesson I was studying.', stars: 5, accent: 'blue'   },
              { name: 'Priya K.', role: 'Product Manager',    text: 'I went from zero to building LangChain agents in 6 weeks. The adaptive quizzes kept me challenged without overwhelming me.', stars: 5, accent: 'violet' },
              { name: 'James T.', role: 'Software Developer', text: "The gamification kept me coming back every day. Earned my certificate in under 2 months — the fastest I've ever learned anything.", stars: 5, accent: 'cyan'   },
            ].map(({ name, role, text, stars, accent }) => {
              const a = {
                blue:   { border: 'border-blue-500/15',   bar: 'bg-blue-500',   avatar: 'from-blue-500 to-blue-700'     },
                violet: { border: 'border-violet-500/15', bar: 'bg-violet-500', avatar: 'from-violet-500 to-violet-700' },
                cyan:   { border: 'border-cyan-500/15',   bar: 'bg-cyan-500',   avatar: 'from-cyan-500 to-teal-600'     },
              }[accent];
              return (
                <div key={name} className={`relative bg-[#0d1117] border ${a.border} rounded-2xl p-6 overflow-hidden`}>
                  <div className={`absolute top-0 left-4 right-4 h-[2px] ${a.bar} rounded-full opacity-50`} />
                  <div className="flex gap-0.5 mb-4 mt-2">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">"{text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.avatar} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{name}</p>
                      <p className="text-gray-600 text-xs">{role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA — vivid centered glow
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c0a1e 0%, #090d1f 50%, #0c0a1e 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-700/20 via-violet-700/25 to-cyan-700/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          <div className="relative bg-[#0a0e1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.025] rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(to right, #818cf8 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Sparkles size={14} className="text-violet-400" />
                <span className="text-xs text-violet-300 font-medium">Free to start, always</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-extrabold mb-5">
                <span className="text-white">The AI Revolution</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Starts With You
                </span>
              </h2>

              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of learners already building the skills that will define the next decade.
              </p>

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-2xl shadow-blue-600/40 hover:scale-[1.03]"
              >
                Join iVersity — It's Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10 text-sm text-gray-600">
                {['No credit card required', 'Access 10 AI courses instantly', 'Certificate on completion'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="relative border-t border-white/5 bg-[#020409]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap size={15} className="text-white" />
                </div>
                <span className="text-lg font-bold">
                  <span className="text-white">i</span>
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Versity</span>
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                The AI-native learning platform for the next generation of builders, thinkers, and creators.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Platform</h4>
              <ul className="space-y-2.5 text-gray-600 text-sm">
                {['Courses', 'Pricing', 'For Teams', 'Blog'].map(l => (
                  <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Company</h4>
              <ul className="space-y-2.5 text-gray-600 text-sm">
                {['About', 'Contact', 'Privacy', 'Terms'].map(l => (
                  <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-700 text-xs">
            <p>© 2026 iVersity. All rights reserved.</p>
            <p className="flex items-center gap-1.5">Built with <Sparkles size={10} className="text-violet-500" /> and AI</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
