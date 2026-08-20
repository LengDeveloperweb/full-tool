import { useState } from 'react';

export default function Navbar({
  isDark,
  onToggleDarkMode,
  onOpenAuth,
  onOpenDonate,
  currentPage,
  onNavigate,
  onBrandClick,
  currentUser,
  onLogout,
  onOpenAccount
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const activeName = currentUser?.name || currentUser?.full_name || currentUser?.username || currentUser?.email || 'User';
  const userInitial = activeName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/80 dark:bg-[#04060a]/80 border-b border-slate-800/80 transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Futuristic Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBrandClick}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-cyan-400 font-black text-xl tracking-tighter group-hover:scale-110 transition-transform duration-300">
                  L
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  leng<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">tool</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Developer & Media Suite
              </p>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/50'
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              currentPage === 'features'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/50'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              currentPage === 'docs'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/50'
            }`}
          >
            Docs
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              currentPage === 'contact'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/50'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Actions: Donate, Theme Toggle & User Auth Profile */}
        <div className="flex items-center gap-3">
          
          {/* Support / Donate Button */}
          <button
            onClick={onOpenDonate}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95 cursor-pointer"
          >
            <span className="text-sm animate-bounce">💖</span>
            <span>Support</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-300 shadow-inner active:scale-95 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Authentication Status / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer active:scale-95"
              >
                <span className="text-xs font-extrabold text-white max-w-[100px] truncate">
                  {activeName}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                  {userInitial}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Signed in as</p>
                    <p className="text-xs font-bold text-cyan-300 truncate mt-0.5">{currentUser.email || activeName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenAccount();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>⚙️</span> Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 p-4 space-y-2 backdrop-blur-2xl animate-fade-in">
          <button
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            🛠️ Tools Collection
          </button>
          <button
            onClick={() => { onNavigate('features'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'features' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            ⚡ Features & Pipeline
          </button>
          <button
            onClick={() => { onNavigate('docs'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'docs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            📖 Documentation
          </button>
          <button
            onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'contact' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            📬 Contact & Support
          </button>
          <button
            onClick={() => { onOpenDonate(); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-500/20 flex items-center gap-2"
          >
            <span>💖</span> Support Developer
          </button>
        </div>
      )}
    </header>
  );
}