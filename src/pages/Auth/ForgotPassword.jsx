import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      const message =
        err?.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : err?.message || 'Failed to send reset email';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl text-white">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="mx-auto text-green-400" size={52} />
              <h2 className="text-2xl font-bold">Check your inbox</h2>
              <p className="text-gray-400">
                We sent a password reset link to{' '}
                <span className="text-white font-medium">{email}</span>. Follow
                the instructions in the email to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-2 text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Reset your password</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
