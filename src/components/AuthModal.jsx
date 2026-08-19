import { useState } from 'react';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

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
          {/* Animated Sliding Pill Indicator */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-cyan-400 rounded-xl transition-transform duration-300 ease-out shadow-lg shadow-cyan-400/30 ${
              isSignUp ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
            }`}
          />
          
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`relative z-10 flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-colors duration-300 cursor-pointer ${
              !isSignUp ? 'text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
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

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
          {isSignUp && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-3 rounded-xl bg-cyan-400 text-slate-950 font-black hover:bg-cyan-300 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 text-sm tracking-wide"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}