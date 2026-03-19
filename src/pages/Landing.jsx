import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOpen, Users, Award, Bot, TrendingUp, Clock, Sparkles, Zap, Target, GraduationCap, ArrowRight, CheckCircle, BarChart2, Layers } from 'lucide-react';
import { getPublishedCourses } from '../services/firestoreService';

const levelConfig = {
  beginner:     { label: 'Beginner',     color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  advanced:     { label: 'Advanced',     color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

const cardAccents = [
  'from-blue-500/20 to-blue-600/5 hover:border-blue-500/50',
  'from-purple-500/20 to-purple-600/5 hover:border-purple-500/50',
  'from-pink-500/20 to-pink-600/5 hover:border-pink-500/50',
  'from-cyan-500/20 to-cyan-600/5 hover:border-cyan-500/50',
  'from-indigo-500/20 to-indigo-600/5 hover:border-indigo-500/50',
  'from-rose-500/20 to-rose-600/5 hover:border-rose-500/50',
];

const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    getPublishedCourses()
      .then(data => setCourses(data))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-blue-400" size={36} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              iVersity
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-sm">
              <Sparkles className="text-blue-400" size={18} />
              <span className="text-sm text-blue-300">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Learn Smarter
              </span>
              <span className="block text-white mt-2">Not Harder</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of education with <span className="text-blue-400 font-semibold">AI-personalized</span> learning paths, 
              adaptive quizzes, and 24/7 virtual assistance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-white/10">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-1">10K+</div>
                <div className="text-gray-400 text-sm">Active Learners</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-1">500+</div>
                <div className="text-gray-400 text-sm">AI-Powered Courses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-1">98%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Courses Section ──────────────────────────────────────────── */}
      <div className="relative py-24 bg-gradient-to-b from-transparent to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
              <Layers className="text-purple-400" size={16} />
              <span className="text-sm text-purple-300">AI-Powered Curriculum</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore Our Courses
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hands-on courses built for the AI era — from absolute beginner to production-ready developer
            </p>
          </div>

          {/* Loading skeletons */}
          {coursesLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-white/10 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-white/10 rounded mb-6 w-5/6"></div>
                  <div className="flex gap-3 mb-6">
                    <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                    <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="h-10 bg-white/10 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

          {/* Course cards */}
          {!coursesLoading && courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => {
                const lvl = levelConfig[course.level] || levelConfig.beginner;
                const accent = cardAccents[idx % cardAccents.length];
                const chapterCount = course.chapters?.length || 0;
                const lessonCount = course.chapters?.reduce((s, ch) => s + (ch.lessons?.length || 0), 0) || 0;
                return (
                  <div
                    key={course.id}
                    className={`group relative bg-gradient-to-br ${accent} bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${lvl.color}`}>
                        {lvl.label}
                      </span>
                      {course.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={13} />
                          {course.duration} weeks
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 border-t border-white/10 pt-4">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} className="text-blue-400" />
                        {chapterCount} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 size={13} className="text-purple-400" />
                        {lessonCount} lessons
                      </span>
                      {course.enrolledStudents > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-pink-400" />
                          {course.enrolledStudents.toLocaleString()} enrolled
                        </span>
                      )}
                    </div>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 text-sm"
                    >
                      Get Started Free
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {!coursesLoading && courses.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p>Courses are being prepared. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-32 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to transform your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Bot className="text-blue-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">AI Personalization</h3>
                <p className="text-gray-400 leading-relaxed">
                  Custom curriculum generated by AI based on your skill level, goals, and learning style
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="text-purple-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Virtual Buddy</h3>
                <p className="text-gray-400 leading-relaxed">
                  24/7 AI assistant that explains concepts, answers questions, and guides your journey
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-pink-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="text-pink-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Adaptive Quizzes</h3>
                <p className="text-gray-400 leading-relaxed">
                  Smart quizzes that adapt difficulty based on your performance for optimal learning
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="text-blue-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Real-Time Progress</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track your learning journey with detailed analytics and progress insights
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="text-purple-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Learn Your Way</h3>
                <p className="text-gray-400 leading-relaxed">
                  Flexible schedule and self-paced learning that fits your lifestyle perfectly
                </p>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-pink-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-pink-400" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Earn Certificates</h3>
                <p className="text-gray-400 leading-relaxed">
                  Industry-recognized certificates to showcase your achievements and skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-center shadow-2xl">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-2xl mb-12 text-blue-100 max-w-2xl mx-auto">
              Join thousands of learners already achieving their goals with AI-powered education
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:scale-105 flex items-center gap-2"
              >
                Start Free Today
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>7-day money back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="text-blue-400" size={32} />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  iVersity
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Transforming education through AI-powered personalized learning. 
                Your journey to mastery starts here.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">For Teams</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 iVersity. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
