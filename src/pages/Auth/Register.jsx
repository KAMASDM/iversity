import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User, Loader, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { registerWithEmail, signInWithGoogle, getUserData } from '../../services/authService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(formData.email, formData.password, {
        fullName: formData.fullName,
        role: 'student',
      });

      // User is signed out after registration — they must verify email first
      setRegisteredEmail(formData.email);
      setRegistered(true);
      toast.success('Account created! Please verify your email before signing in.');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
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
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google');
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
            <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 font-medium">Free</span>
            <span className="text-sm text-gray-400">Start learning today</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Join <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">10,000+</span> learners
          </h1>

          <p className="text-gray-400 max-w-xl">
            Get personalized AI-powered learning paths, adaptive quizzes, and 24/7 virtual assistance. Start your journey today.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-semibold">AI-Personalized Learning</div>
                <div className="text-sm text-gray-400">Custom curriculum for your level</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-semibold">Adaptive Quizzes</div>
                <div className="text-sm text-gray-400">Questions that match your pace</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-semibold">24/7 Virtual Buddy</div>
                <div className="text-sm text-gray-400">AI assistant always ready to help</div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-4">
            <div>
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">AI Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">98%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Right - form */}
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">

            {registered ? (
              /* Email verification success screen */
              <div className="text-center text-white space-y-6 py-4">
                <CheckCircle className="mx-auto text-green-400" size={56} />
                <h2 className="text-2xl font-bold">Verify your email</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We sent a verification link to{' '}
                  <span className="font-semibold text-white">{registeredEmail}</span>.
                  Click the link in the email to activate your account.
                </p>
                <p className="text-xs text-gray-500">Don't see it? Check your spam or junk folder.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform"
                >
                  Go to Sign in <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
            <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-sm text-gray-300">Start your learning journey with iVersity</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="text-sm text-gray-300 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm text-gray-300 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : <><span>Create Account</span><ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative inline-block bg-gray-900/70 px-3 py-1 rounded-full text-sm text-gray-300">Or continue with</div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/6 border border-white/10 rounded-lg hover:bg-white/10 transition"
              >
                <FcGoogle size={20} />
                <span className="text-white">Sign up with Google</span>
              </button>

              <p className="mt-5 text-center text-sm text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
