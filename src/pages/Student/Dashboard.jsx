import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { useAuthStore, useEnrollmentStore } from '../../store';
import {
  getStudentEnrollments, getCourse, getStudentGamification, getPublishedCourses,
} from '../../services/firestoreService';
import { courseProgress, lastActivity } from '../../utils/progress';
import {
  ArrowRight, Award, BookOpen, CheckCircle2, Clock, Compass, Flame, GraduationCap, PlayCircle, Sparkles, Zap,
} from 'lucide-react';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const StudentDashboard = () => {
  const { user, userData } = useAuthStore();
  const { setEnrollments } = useEnrollmentStore();
  const [items, setItems] = useState([]);          // [{ enrollment, course, gamification, stats }]
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const enrollments = await getStudentEnrollments(user.uid);
        setEnrollments(enrollments);

        const loaded = await Promise.all(enrollments.map(async (enrollment) => {
          const [course, gamification] = await Promise.all([
            getCourse(enrollment.courseId).catch(() => null),
            getStudentGamification(user.uid, enrollment.courseId).catch(() => null),
          ]);
          return course ? { enrollment, course, gamification, stats: courseProgress(course, enrollment) } : null;
        }));
        const valid = loaded.filter(Boolean).sort((a, b) => lastActivity(b.enrollment) - lastActivity(a.enrollment));
        if (cancelled) return;
        setItems(valid);

        const enrolledIds = new Set(enrollments.map(e => e.courseId));
        const published = await getPublishedCourses().catch(() => []);
        if (!cancelled) setSuggestions(published.filter(c => !enrolledIds.has(c.id)).slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, setEnrollments]);

  const active = items.filter(i => !i.stats.certified && i.enrollment.status !== 'completed');
  const completed = items.filter(i => i.stats.certified || i.enrollment.status === 'completed');
  const resume = active[0];

  const totals = useMemo(() => ({
    xp: items.reduce((sum, i) => sum + (i.gamification?.points || 0), 0),
    streak: Math.max(0, ...items.map(i => i.gamification?.streak || 0)),
    lessons: items.reduce((sum, i) => sum + i.stats.completed, 0),
    certificates: completed.length,
  }), [items, completed.length]);

  const firstName = (userData?.displayName || '').split(' ')[0];

  return (
    <StudentLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Greeting */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">{greeting()}{firstName ? ',' : ''}</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{firstName || 'Welcome back'} 👋</h1>
          </div>
          {!loading && items.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Chip icon={Flame} tone="orange" label={`${totals.streak}-day streak`} />
              <Chip icon={Zap} tone="violet" label={`${totals.xp} XP`} />
            </div>
          )}
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : items.length === 0 ? (
          <FirstRun suggestions={suggestions} />
        ) : (
          <>
            {/* Resume */}
            {resume ? <ResumeCard item={resume} /> : <AllDoneCard />}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat icon={BookOpen} label="In progress" value={active.length} />
              <Stat icon={CheckCircle2} label="Lessons completed" value={totals.lessons} />
              <Stat icon={Award} label="Certificates" value={totals.certificates} />
              <Stat icon={Zap} label="Total XP" value={totals.xp} />
            </div>

            {/* Courses */}
            {active.length > 0 && (
              <section>
                <SectionTitle title="Your courses" action={<Link to="/student/progress" className="text-sm text-blue-300 hover:text-blue-200">See progress</Link>} />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {active.map(item => <CourseCard key={item.enrollment.id} item={item} />)}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <SectionTitle title="Completed" action={<Link to="/student/certificates" className="text-sm text-blue-300 hover:text-blue-200">Certificates</Link>} />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {completed.map(item => <CourseCard key={item.enrollment.id} item={item} />)}
                </div>
              </section>
            )}

            {suggestions.length > 0 && (
              <section>
                <SectionTitle title="Explore next" action={<Link to="/student/courses" className="text-sm text-blue-300 hover:text-blue-200">Browse all</Link>} />
                <div className="grid gap-4 md:grid-cols-3">
                  {suggestions.map(course => <SuggestionCard key={course.id} course={course} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
};

// ── Pieces ────────────────────────────────────────────────────────────────────

const CHIP_TONES = {
  orange: 'border-orange-500/25 bg-orange-500/10 text-orange-200',
  violet: 'border-violet-500/25 bg-violet-500/10 text-violet-200',
};

const Chip = ({ icon: Icon, tone, label }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${CHIP_TONES[tone]}`}>
    <Icon size={14} /> {label}
  </span>
);

const SectionTitle = ({ title, action }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {action}
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
    <Icon size={18} className="text-gray-400" />
    <p className="mt-3 text-2xl font-bold tabular-nums text-white">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

const ProgressBar = ({ pct, className = '' }) => (
  <div className={`h-2 overflow-hidden rounded-full bg-white/10 ${className}`}>
    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
  </div>
);

const ResumeCard = ({ item }) => {
  const { enrollment, course, stats } = item;
  const to = stats.examReady ? `/student/exam/${enrollment.id}` : `/student/course-room/${enrollment.id}`;
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent p-6 sm:p-8 transition-colors hover:border-blue-400/40"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
            {stats.examReady ? 'Ready for your final exam' : stats.completed === 0 ? 'Start learning' : 'Pick up where you left off'}
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">{course.title}</h2>
          {stats.next && !stats.examReady && (
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-300">
              <PlayCircle size={16} className="shrink-0 text-blue-300" />
              <span className="truncate">Next: {stats.next.lesson.title}</span>
              {stats.next.lesson.estimatedMinutes && (
                <span className="flex shrink-0 items-center gap-1 text-gray-500"><Clock size={13} /> {stats.next.lesson.estimatedMinutes} min</span>
              )}
            </p>
          )}
          {stats.examReady && (
            <p className="mt-2 text-sm text-gray-300">You've finished every lesson. Pass the exam (70%) to earn your certificate.</p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <ProgressBar pct={stats.pct} className="max-w-sm flex-1" />
            <span className="text-sm tabular-nums text-gray-300">{stats.pct}%</span>
            <span className="hidden sm:inline text-xs text-gray-500">{stats.completed}/{stats.total} lessons</span>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-transform group-hover:translate-x-0.5">
          {stats.examReady ? <><GraduationCap size={16} /> Take exam</> : <>{stats.completed === 0 ? 'Start course' : 'Resume'} <ArrowRight size={16} /></>}
        </span>
      </div>
    </Link>
  );
};

const AllDoneCard = () => (
  <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">All caught up</p>
    <h2 className="mt-2 text-xl font-bold text-white">You've completed every course you're enrolled in 🎉</h2>
    <Link to="/student/courses" className="btn-primary-gradient mt-5">Find your next course <ArrowRight size={16} /></Link>
  </div>
);

const CourseCard = ({ item }) => {
  const { enrollment, course, stats } = item;
  const to = stats.certified ? '/student/certificates' : stats.examReady ? `/student/exam/${enrollment.id}` : `/student/course-room/${enrollment.id}`;
  return (
    <Link to={to} className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center gap-2">
        {course.level && <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] capitalize text-gray-400">{course.level}</span>}
        {stats.certified && <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300"><Award size={11} /> Certified</span>}
        {stats.examReady && <span className="flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] text-violet-200"><GraduationCap size={11} /> Exam ready</span>}
      </div>
      <h3 className="font-semibold leading-snug text-white group-hover:text-blue-200">{course.title}</h3>
      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
        {stats.certified ? `Final exam: ${enrollment.examScore ?? '—'}%` : stats.next ? `Next: ${stats.next.lesson.title}` : 'All lessons complete'}
      </p>
      <div className="mt-auto pt-5">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-gray-500">{stats.completed}/{stats.total} lessons</span>
          <span className="tabular-nums text-gray-300">{stats.pct}%</span>
        </div>
        <ProgressBar pct={stats.pct} />
      </div>
    </Link>
  );
};

const SuggestionCard = ({ course }) => (
  <Link to={`/student/courses/${course.id}`} className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
    <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-400">
      <Compass size={13} className="text-blue-300" />
      <span className="capitalize">{course.level}</span>
      {course.duration && <span>· {course.duration} weeks</span>}
    </div>
    <h3 className="font-semibold leading-snug text-white group-hover:text-blue-200">{course.title}</h3>
    <p className="mt-2 line-clamp-2 text-sm text-gray-400">{course.description}</p>
  </Link>
);

const FirstRun = ({ suggestions }) => (
  <div className="space-y-6">
    <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-transparent p-8 sm:p-10">
      <Sparkles size={28} className="text-violet-300" />
      <h2 className="mt-4 text-2xl font-bold text-white">Let's start your first course</h2>
      <p className="mt-2 max-w-lg text-gray-300">
        Pick a course, work through short lessons at your own pace, check your understanding with quick quizzes,
        and ask Buddy whenever you get stuck. Finish and pass the final exam to earn a certificate.
      </p>
      <Link to="/student/courses" className="btn-primary-gradient mt-6">Browse courses <ArrowRight size={16} /></Link>
    </div>
    {suggestions.length > 0 && (
      <div className="grid gap-4 md:grid-cols-3">
        {suggestions.map(course => <SuggestionCard key={course.id} course={course} />)}
      </div>
    )}
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    <div className="h-44 animate-pulse rounded-3xl bg-white/[0.04]" />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[0, 1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />)}
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map(i => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/[0.04]" />)}
    </div>
  </div>
);

export default StudentDashboard;
