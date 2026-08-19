import { useState } from 'react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Dashboard', id: 'home' },
  { label: 'Support / Donate', id: 'donatemodal' },
  { label: 'Contact', id: 'contact' },
  { label: 'Docs', id: 'docs' },
];

export default function Navbar({ 
  isDark, 
  onToggleDarkMode, 
  onOpenAuth, 
  onOpenDonate, 
  currentPage, 
  onNavigate,
  onBrandClick // 1. Added onBrandClick prop
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id) => {
    if (id === 'donatemodal') {
      if (onOpenDonate) onOpenDonate();
    } else {
      if (onNavigate) onNavigate(id);
    }
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    if (onBrandClick) {
      onBrandClick(); // Triggers page refresh passed from App.jsx
    } else {
      handleNavClick('home');
    }
  };

  return (
    <nav className="bg-slate-800 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-700 dark:border-cyan-900/40 text-slate-100 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Click Refreshes Page */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                      : 'text-slate-300 hover:text-cyan-400'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-400 after:rounded-full after:transition-transform after:duration-300 ${
                    isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-lg text-xs font-bold border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm shadow-cyan-950"
            >
              Sign In
            </button>
            
            <button
              onClick={onToggleDarkMode}
              type="button"
              className="p-2 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-cyan-800/50 text-cyan-400 hover:border-cyan-400 transition-all cursor-pointer active:scale-95"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950"
            >
              Sign In
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 text-slate-300 hover:text-cyan-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-cyan-900/40 px-4 pt-2 pb-4 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}