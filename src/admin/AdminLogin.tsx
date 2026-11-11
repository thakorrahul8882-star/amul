import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Store,
} from 'lucide-react';

export const AdminLogin: React.FC<{ onBackToStore: () => void }> = ({
  onBackToStore,
}) => {
  const { loginWithGoogle, loginWithEmail, error, clearError } = useAuth();
  const [email, setEmail] = useState('thakorrahul8882@gmail.com');
  const [password, setPassword] = useState('Amul@8849');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in error';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background dairy accents */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        
        {/* Back to Customer website */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ગ્રાહક વેબસાઇટ પર પાછા જાઓ (Back to Customer Store)</span>
        </button>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-red-600 rounded-3xl mx-auto flex flex-col items-center justify-center text-white shadow-xl border-2 border-red-500">
            <span className="font-extrabold text-lg leading-none font-serif">Amul</span>
            <span className="text-[9px] font-bold tracking-widest text-yellow-300">ADMIN</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            અમૂલ પાર્લર ખોડાણા
          </h2>
          <p className="text-xs text-red-400 font-semibold">
            દૂધ મંડળી દ્વારા સંચાલિત - સંચાલક પોર્ટલ (Admin Dashboard)
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-slate-800 border border-slate-700 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          
          {(localError || error) && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Google Sign-in */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow transition-all active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google એકાઉન્ટથી સાઇન ઇન કરો</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              (અધિકૃત ઇમેઇલ: <span className="text-yellow-400">thakorrahul8882@gmail.com</span>)
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-700 w-full"></div>
            <span className="bg-slate-800 px-3 text-xs text-slate-400 uppercase font-semibold">
              અથવા પાસવર્ડથી
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                એડમિન ઇમેઇલ / યૂઝરનેમ
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@amulkhodana.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                પાસવર્ડ
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98 text-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-yellow-300" />
                  <span>સંચાલક ડેશબોર્ડ ખોલો</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700 text-center">
            <div className="text-[11px] text-slate-400">
              સુરક્ષિત એડમિન પોર્ટલ • માત્ર અધિકૃત સંચાલક માટે
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
