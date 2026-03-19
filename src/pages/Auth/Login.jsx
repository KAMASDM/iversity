import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { signInWithEmail, signInWithGoogle, getUserData, logOut, resendVerificationEmail } from '../../services/authService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await signInWithEmail(formData.email, formData.password);

      // Block access for email/password users who haven't verified their email
      if (!user.emailVerified) {
        await resendVerificationEmail(user);
        await logOut();
        setUnverifiedEmail(formData.email);
        return;
      }

      const userData = await getUserData(user.uid);
      setUser(user);
      setUserData(userData);
      toast.success('Welcome back!');
      navigate(userData?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const userData = await getUserData(user.uid);
      setUser(user);
      setUserData(userData);
      toast.success('Signed in successfully!');
      navigate(userData?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left - marketing */}
        <div className="text-white space-y-8 px-4">
          <div className="inline-flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 font-medium">New</span>
            <span className="text-sm text-gray-400">AI-powered personalized learning</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Learn faster with <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">smart AI</span>
          </h1>

          <p className="text-gray-400 max-w-xl">
            Personalized curriculums, adaptive quizzes, and a 24/7 virtual buddy to guide your progress. Sign in to continue your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
              Create Account
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-white/90 border border-white/10 hover:bg-white/10 transition">
              Learn More
            </Link>
          </div>

          <div className="mt-6 flex gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-sm text-gray-400">Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">Courses</div>
            </div>
          </div>
        </div>

        {/* Right - form */}
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-sm text-gray-300">Sign in to your iVersity account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {unverifiedEmail && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
                  <p className="font-semibold text-amber-300 mb-1">Email not verified</p>
                  <p className="text-amber-200/80">
                    A verification link was sent to{' '}
                    <span className="font-medium text-white">{unverifiedEmail}</span>.
                    Please check your inbox (and spam folder), then sign in again.
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm text-gray-300 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10" />
                  <label htmlFor="remember" className="text-gray-300">Remember me</label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-300 hover:underline">Forgot?</Link>
              </div>

              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                {loading ? <Loader className="animate-spin" size={18} /> : 'Sign in'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative inline-block bg-gray-900/70 px-3 py-1 rounded-full text-sm text-gray-300">Or continue with</div>
              </div>

              <button onClick={handleGoogleSignIn} disabled={loading} className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/6 border border-white/10 rounded-lg hover:bg-white/10 transition">
                <FcGoogle size={20} />
                <span className="text-white">Sign in with Google</span>
              </button>

              <p className="mt-5 text-center text-sm text-gray-300">Don't have an account? <Link to="/register" className="text-blue-300 font-semibold">Create one</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
