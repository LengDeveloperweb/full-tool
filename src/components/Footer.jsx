
import Logo from './Logo';

export default function Footer({ onOpenDonate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-cyan-950/40 text-slate-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Top Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Logo />
            <p className="text-sm text-slate-400 dark:text-cyan-100/60 leading-relaxed max-w-md">
              Fast, simple, and privacy-first online tools built for developers, students, and everyday users in Cambodia.
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Client-Side Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Execution
              </span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#community" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Leng Community
                </a>
              </li>
              <li>
                {/* Donate Modal Trigger */}
                <button 
                  type="button"
                  onClick={onOpenDonate}
                  className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Support / Donate
                </button>
              </li>
              <li>
                <a href="#terms" className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">&gt;</span> Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">&gt;</span> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">&gt;</span> Contact / Support
                </a>
              </li>
              <li>
                <a href="#sitemap" className="text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">&gt;</span> HTML Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Platform Features Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Connect With Us
            </h4>
            
            {/* Social Links (Telegram & Facebook) */}
            <div className="flex flex-col gap-2.5">
              <a 
                href="https://t.me/lengdeveloper" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all text-xs group"
              >
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.68-.55.84-1.12.52l-3.05-2.25-1.47 1.42c-.16.16-.3.3-.62.3l.22-3.11 5.66-5.11c.25-.22-.05-.34-.38-.12l-7 4.41-3.01-.94c-.66-.21-.67-.66.14-.98l11.78-4.54c.55-.2 1.03.13.82.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Telegram Channel</p>
                  <p className="text-[10px] text-slate-500">Join our community</p>
                </div>
              </a>

              <a 
                href="https://www.facebook.com/share/1DYa1yfBZy/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all text-xs group"
              >
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Facebook Page</p>
                  <p className="text-[10px] text-slate-500">Follow for updates</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2026 LENGTOOL • Built under <span className="text-cyan-400 font-semibold">Leng Community</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms</a>
            <span>•</span>
            <a href="#sitemap" className="hover:text-cyan-400 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 hover:bg-slate-700 hover:border-cyan-500 transition-all duration-200 shadow-xl shadow-cyan-950/40 cursor-pointer active:scale-90 z-40"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}