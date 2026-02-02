import { useState } from 'react';
import { useRouter } from 'next/router';
import { LogIn, AlertCircle, Lock } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please fill password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/rootLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <div className="text-xs tracking-[0.4em] uppercase text-amber-100 font-semibold mb-3">
              Administration
            </div>
            <h1 className="text-4xl font-serif font-bold text-white leading-tight">
              Root
              <br />
              <span className="italic">Login</span>
            </h1>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-rose-900 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-stone-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all bg-white text-stone-900 font-medium placeholder:text-stone-400"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full px-8 py-5 overflow-hidden rounded-lg font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-200">
            <p className="text-center text-sm text-stone-600 font-light">
              Secure admin access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const root = verifyAuth(req, res);

  if (root) {
    return {
      redirect: {
        destination: "/admin/",
        permanent: false,
      },
    };
  }

  return {
    props: { session: null },
  };
}