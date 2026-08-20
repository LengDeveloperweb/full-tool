import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up request
        const res = await fetch('http://localhost:8000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Failed to sign up');
        }

        // Automatically switch or sign in after successful sign up
        setIsSignUp(false);
      }

      // Sign In request (FastAPI OAuth2 expects x-www-form-urlencoded format)
      const details = { username, password };
      const formBody = Object.keys(details)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
        .join('&');

      const tokenRes = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody,
      });

      if (!tokenRes.ok) {
        throw new Error('Incorrect username or password');
      }

      const tokenData = await tokenRes.json();
      
      // FIXED: Use 'access_token' so App.jsx can read it properly on refresh
      localStorage.setItem('access_token', tokenData.access_token);

      // Fetch user profile
      const profileRes = await fetch('http://localhost:8000/users/me', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      });

      if (profileRes.ok) {
        const userData = await profileRes.json();
        onLoginSuccess(userData);
        onClose();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-7 pt-9 shadow-[0_0_50px_rgba(34,211,238,0.15)] text-slate-100 overflow-hidden animate-[scaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Repositioned Top-Right Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/60 hover:bg-slate-800 transition-all duration-200 cursor-pointer active:scale-90 shadow-md"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab Switcher Bar */}
        <div className="relative flex bg-slate-950/70 p-1.5 rounded-2xl mb-7 border border-slate-800/80 backdrop-blur-sm">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-cyan-400 rounded-xl transition-transform duration-300 ease-out shadow-lg shadow-cyan-400/30 ${
              isSignUp ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
            }`}
          />
          
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`relative z-10 flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-colors duration-300 cursor-pointer ${
              !isSignUp ? 'text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`relative z-10 flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-colors duration-300 cursor-pointer ${
              isSignUp ? 'text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black tracking-tight text-white">
            {isSignUp ? 'Create LengTool Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-cyan-200/60 mt-1.5">
            {isSignUp ? 'Sign up to sync your preferences across devices' : 'Enter your credentials to access your saved tools'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-red-950/60 border border-red-900/60 text-red-400 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. chab"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
                required
              />
              {/* Show / Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-3 rounded-xl bg-cyan-400 text-slate-950 font-black hover:bg-cyan-300 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 text-sm tracking-wide disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
}