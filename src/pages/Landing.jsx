import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BookOpen, Users, Award, Bot, TrendingUp, Clock, Sparkles, Zap,
  GraduationCap, ArrowRight, CheckCircle, BarChart2, Layers,
  Brain, Code2, Network, Shield, ChevronRight, Star,
} from 'lucide-react';
import { getPublishedCourses } from '../services/firestoreService';

// ─── Config ───────────────────────────────────────────────────────────────────
const levelConfig = {
  beginner:     { label: 'Beginner',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  advanced:     { label: 'Advanced',     color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
};
const cardGlows = [
  'hover:shadow-blue-500/20',
  'hover:shadow-violet-500/20',
  'hover:shadow-cyan-500/20',
  'hover:shadow-pink-500/20',
  'hover:shadow-indigo-500/20',
  'hover:shadow-purple-500/20',
];
const cardBorders = [
  'hover:border-blue-500/50',
  'hover:border-violet-500/50',
  'hover:border-cyan-500/50',
  'hover:border-pink-500/50',
  'hover:border-indigo-500/50',
  'hover:border-purple-500/50',
];

// ─── Reusable: section divider with label ─────────────────────────────────────
const SectionDivider = ({ label, color = 'blue' }) => {
  const colors = {
    blue:   'text-blue-400 border-blue-500/30 bg-blue-500/10',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    cyan:   'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    pink:   'text-pink-400 border-pink-500/30 bg-pink-500/10',
  };
  return (
    <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className={`px-4 py-1 rounded-full text-xs font-mono font-bold border tracking-widest uppercase ${colors[color]}`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// ─── Reusable: feature card ───────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, accent }) => {
  const accents = {
    blue:   { bg: 'from-blue-500/20 to-blue-600/5',   icon: 'from-blue-500/30 to-blue-700/20',   text: 'text-blue-400',   border: 'hover:border-blue-500/50',   glow: 'group-hover:shadow-blue-500/15'  },
    violet: { bg: 'from-violet-500/20 to-violet-600/5', icon: 'from-violet-500/30 to-violet-700/20', text: 'text-violet-400', border: 'hover:border-violet-500/50', glow: 'group-hover:shadow-violet-500/15' },
    cyan:   { bg: 'from-cyan-500/20 to-cyan-600/5',    icon: 'from-cyan-500/30 to-cyan-700/20',    text: 'text-cyan-400',   border: 'hover:border-cyan-500/50',   glow: 'group-hover:shadow-cyan-500/15'  },
    pink:   { bg: 'from-pink-500/20 to-pink-600/5',    icon: 'from-pink-500/30 to-pink-700/20',    text: 'text-pink-400',   border: 'hover:border-pink-500/50',   glow: 'group-hover:shadow-pink-500/15'  },
    emerald:{ bg: 'from-emerald-500/20 to-emerald-600/5',icon:'from-emerald-500/30 to-emerald-700/20',text:'text-emerald-400',border:'hover:border-emerald-500/50',glow:'group-hover:shadow-emerald-500/15'},
    indigo: { bg: 'from-indigo-500/20 to-indigo-600/5', icon: 'from-indigo-500/30 to-indigo-700/20', text: 'text-indigo-400', border: 'hover:border-indigo-500/50', glow: 'group-hover:shadow-indigo-500/15' },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`group relative bg-gradient-to-br ${a.bg} bg-gray-900/60 backdrop-blur-lg border border-white/8 ${a.border} rounded-2xl p-7 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${a.glow}`}>
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-2xl">
        <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${a.bg} rounded-full opacity-40`} />
      </div>
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${a.icon} mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={a.text} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    getPublishedCourses()
      .then(d => setCourses(d))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">

      {/* ── Global background ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none select-none">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[100px]" />
        {/* Horizontal glow lines */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="relative z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 blur opacity-30" />
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
              { val: '10K+',   label: 'Active Learners',    color: 'text-blue-400' },
              { val: '5',      label: 'AI Courses',         color: 'text-violet-400' },
              { val: '98%',    label: 'Completion Rate',    color: 'text-cyan-400' },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-gray-900/60 backdrop-blur px-8 py-6 text-center">
                <div className={`text-4xl font-extrabold tabular-nums mb-1 ${color}`}>{val}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COURSES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24">
        {/* Top border glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-violet-900/8 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// Curriculum" color="violet" />

          <div className="text-center mt-10 mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-white">Courses Built for the</span>{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI Era</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From AI foundations to production-ready agents — hands-on, project-based, adaptive.
            </p>
          </div>

          {/* Loading skeletons */}
          {coursesLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-5 w-24 bg-white/8 rounded-full" />
                    <div className="h-5 w-16 bg-white/8 rounded-full" />
                  </div>
                  <div className="h-6 bg-white/8 rounded mb-3 w-4/5" />
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-white/6 rounded w-full" />
                    <div className="h-4 bg-white/6 rounded w-5/6" />
                    <div className="h-4 bg-white/6 rounded w-3/4" />
                  </div>
                  <div className="h-10 bg-white/8 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Course cards */}
          {!coursesLoading && courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => {
                const lvl = levelConfig[course.level] || levelConfig.beginner;
                const chapterCount = course.chapters?.length || 0;
                const lessonCount  = course.chapters?.reduce((s, ch) => s + (ch.lessons?.length || 0), 0) || 0;
                const glow   = cardGlows[idx % cardGlows.length];
                const border = cardBorders[idx % cardBorders.length];
                return (
                  <div
                    key={course.id}
                    className={`group relative flex flex-col bg-gray-900/70 backdrop-blur border border-white/8 ${border} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${glow} overflow-hidden`}
                  >
                    {/* Top shimmer line on hover */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full border tracking-wide uppercase ${lvl.color}`}>
                        {lvl.label}
                      </span>
                      {course.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {course.duration}w
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-5 pt-4 border-t border-white/6">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} className="text-blue-500" />
                        {chapterCount} ch.
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 size={12} className="text-violet-500" />
                        {lessonCount} lessons
                      </span>
                      {course.enrolledStudents > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-cyan-500" />
                          {course.enrolledStudents.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-blue-600/80 border border-white/10 hover:border-blue-500/0 text-white font-semibold rounded-xl transition-all duration-200 text-sm group/btn"
                    >
                      Enroll Free
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
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
          FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-gradient-to-b from-[#070b18] to-[#030712]">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-900/6 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// Features" color="blue" />

          <div className="text-center mt-10 mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Every Tool You Need to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI-native platform adapts to how you learn, not the other way around.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          HOW IT WORKS — 3 steps
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// How It Works" color="cyan" />

          <div className="text-center mt-10 mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Three Steps to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Mastery</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-cyan-500/30" />

            {[
              {
                step: '01', color: 'blue',
                icon: Code2,
                title: 'Enroll & Personalize',
                desc: 'Answer a short questionnaire. Our AI instantly maps a personalized learning path tailored to your level and goals.',
              },
              {
                step: '02', color: 'violet',
                icon: Brain,
                title: 'Learn Interactively',
                desc: 'Study structured lessons with live code examples, chapter quizzes, notes, and your AI Buddy answering every question.',
              },
              {
                step: '03', color: 'cyan',
                icon: Award,
                title: 'Get Certified',
                desc: 'Pass the AI-evaluated final exam, receive your certificate, and add it to your portfolio.',
              },
            ].map(({ step, color, icon: Icon, title, desc }) => {
              const colors = {
                blue:   { num: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',   icon: 'bg-blue-500/15 text-blue-400'   },
                violet: { num: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', icon: 'bg-violet-500/15 text-violet-400' },
                cyan:   { num: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20',   icon: 'bg-cyan-500/15 text-cyan-400'   },
              };
              const c = colors[color];
              return (
                <div key={step} className="relative flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl border ${c.bg} flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                    <Icon size={32} className={c.num} />
                  </div>
                  <span className={`absolute top-0 right-[calc(50%-2.5rem)] font-mono text-xs font-bold ${c.num} opacity-50`}>{step}</span>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIAL / SOCIAL PROOF
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-gradient-to-b from-[#070b18] to-[#030712]">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-violet-900/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="// Learners say" color="pink" />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alex M.', role: 'ML Engineer', text: 'The AI Buddy actually understands course context. It answered my RAG questions with specific examples from the lesson I was studying.', stars: 5 },
              { name: 'Priya K.', role: 'Product Manager', text: 'I went from zero to building LangChain agents in 6 weeks. The adaptive quizzes kept me challenged without overwhelming me.', stars: 5 },
              { name: 'James T.', role: 'Software Developer', text: "The gamification kept me coming back every day. Earned my certificate in under 2 months — the fastest I've ever learned anything.", stars: 5 },
            ].map(({ name, role, text, stars }) => (
              <div key={name} className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-gray-600 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow backdrop */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20 rounded-3xl blur-2xl" />

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-14 text-center overflow-hidden">
            {/* Inner grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] rounded-3xl"
              style={{
                backgroundImage: 'linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(to right, #818cf8 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* Top accent */}
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

              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of learners already building the skills that will define the next decade.
              </p>

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-2xl shadow-blue-600/40 hover:scale-[1.03]"
              >
                Join iVersity — It's Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-gray-600">
                {['No credit card required', 'Access 5 AI courses instantly', 'Certificate on completion'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
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
      <footer className="relative border-t border-white/6 bg-[#020509]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap size={16} className="text-white" />
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
              <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">Platform</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                {['Courses', 'Pricing', 'For Teams', 'Blog'].map(l => (
                  <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">Company</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                {['About', 'Contact', 'Privacy', 'Terms'].map(l => (
                  <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-700 text-xs">
            <p>© 2026 iVersity. All rights reserved.</p>
            <p className="flex items-center gap-1.5">Built with <Sparkles size={11} className="text-violet-500" /> and AI</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
