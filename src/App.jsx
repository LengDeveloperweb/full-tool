import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import ContactPage from './components/ContactPage';
import FeaturesPage from './components/FeaturesPage';
import DocsPage from './components/DocsPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DonateModal from './components/DonateModal';
import AccountModal from './components/AccountModal';
import SupporterWall from './components/SupporterWall';
import QrCodeGenerator from './components/QrCodeGenerator';
import PdfStudio from './components/PdfStudio';
import PhotoCollageMaker from './components/PhotoCollageMaker';

// Live Render backend URL configuration
const API_BASE_URL = 'https://full-tool.onrender.com';

const CATEGORIES = ['All', 'Media', 'Developer', 'Utility', 'Design', 'Text'];

const TOOLS_DATA = [
  { id: 1, slug: 'photo-collage', title: 'Photo Collage Maker', description: 'Combine photos, customize layouts, borders, and templates instantly.', category: 'Media', badge: 'Popular' },
  { id: 2, slug: 'pdf-studio', title: 'PDF Converter & Studio', description: 'Merge, split, compress, and convert PDF files directly in your browser.', category: 'Media', badge: 'Popular' },
  { id: 3, slug: 'qr-generator', title: 'QR Code Generator', description: 'Generate custom QR codes with custom colors and links.', category: 'Utility', badge: 'New' },
  { id: 4, slug: 'css-gradient', title: 'CSS Gradient Generator', description: 'Create modern background gradients and copy Tailwind CSS code.', category: 'Design' },
  { id: 5, slug: 'svg-minifier', title: 'SVG Minifier', description: 'Optimize and clean up raw SVG markup for web production.', category: 'Developer' },
  { id: 6, slug: 'text-case', title: 'Text Case Converter', description: 'Convert text strings to UPPERCASE, lowercase, camelCase, and titlecase.', category: 'Text' },
  { id: 7, slug: 'salary-tax', title: 'Salary Tax Calculator', description: 'Calculate Cambodian salary tax brackets and resident withholding taxes easily.', category: 'Utility', badge: 'Khmer TAX' },
  { id: 8, slug: 'json-formatter', title: 'JSON Formatter', description: 'Validate, format, and beautify your JSON data instantly.', category: 'Developer' },
  { id: 9, slug: 'tailwind-color', title: 'Tailwind Color Converter', description: 'Convert RGB, HEX, and HSL colors into nearest Tailwind CSS color classes.', category: 'Design' },
  { id: 10, slug: 'regex-tester', title: 'Regex Tester', description: 'Test and debug JavaScript regular expressions with real-time highlighting.', category: 'Developer' },
  { id: 11, slug: 'base64', title: 'Base64 Encoder / Decoder', description: 'Encode or decode strings and binary data using standard Base64 format.', category: 'Developer' },
  { id: 12, slug: 'lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generate custom placeholder text in paragraphs, words, or lists for wireframes.', category: 'Text' },
  { id: 13, slug: 'meta-tags', title: 'Meta Tags & OpenGraph Builder', description: 'Preview and generate meta tags for SEO and social media sharing cards.', category: 'Developer', badge: 'SEO' },
  { id: 14, slug: 'px-to-rem', title: 'px to rem Converter', description: 'Quickly convert pixel measurements into rem or em units for responsive CSS.', category: 'Design' },
  { id: 15, slug: 'markdown-editor', title: 'Markdown Editor & Previewer', description: 'Write Markdown with real-time styled HTML output and instant copy export.', category: 'Text' },
  { id: 16, slug: 'uuid-generator', title: 'UUID / GUID Generator', description: 'Generate v4 cryptographically secure unique identifiers in bulk.', category: 'Utility' },
  { id: 17, slug: 'html-entity', title: 'HTML Entity Encoder', description: 'Safely convert special characters into HTML entities to prevent XSS issues.', category: 'Developer' },
  { id: 18, slug: 'url-encoder', title: 'URL Encoder / Decoder', description: 'Sanitize query strings and escape special characters for Web APIs.', category: 'Utility' },
];

const CURATED_SHOWCASE = [
  {
    title: "⚡ High-Performance Media Studio",
    subtitle: "Curated Workflow Collection",
    desc: "Process high-resolution images, combine layouts, and compile documents directly inside your browser container.",
    slug: "photo-collage",
    badge: "Featured Gallery",
    stats: "18+ Utilities"
  },
  {
    title: "🇰🇭 Localized Cambodian Tax Suite",
    subtitle: "Financial & Compliance",
    desc: "Instantly compute progressive resident salary tax rules and deductions with real-time currency formatting.",
    slug: "salary-tax",
    badge: "Trending Tool",
    stats: "Instant Calculation"
  },
  {
    title: "🎨 Modern Design & Gradient Engine",
    subtitle: "Frontend Asset Pipeline",
    desc: "Generate production-ready CSS linear gradients, copy tailwind tokens, and streamline your UI workflow.",
    slug: "css-gradient",
    badge: "Developer Choice",
    stats: "Zero Latency"
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  
  // Guard reference to prevent React Strict Mode double execution (+2 count bug)
  const hasFetchedVisit = useRef(false);

  // Showcase Carousel Active Index
  const [activeSlide, setActiveSlide] = useState(0);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Auto-advance showcase slide every 6 seconds with smooth transition timing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CURATED_SHOWCASE.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Check token on initial app load to restore session from FastAPI backend
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch(`${API_BASE_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(userData => setCurrentUser(userData))
        .catch(() => localStorage.removeItem('access_token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Track global visitor counts from PostgreSQL database via FastAPI (runs once securely)
  useEffect(() => {
    if (hasFetchedVisit.current) return;
    hasFetchedVisit.current = true;

    fetch(`${API_BASE_URL}/api/visits`)
      .then(res => res.json())
      .then(data => {
        if (data && data.visit_count) {
          setVisitCount(data.visit_count);
        }
      })
      .catch(err => console.error('Failed to fetch visit count:', err));
  }, []);

  useEffect(() => {
    document.title = 'lengtool';
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const handleRefresh = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 dark:bg-[#04060a] dark:text-cyan-50 transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onBrandClick={handleRefresh}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'docs' && <DocsPage />}
        
        {currentPage === 'qr-generator' && <QrCodeGenerator onNavigate={handleNavigate} />}
        {currentPage === 'pdf-studio' && <PdfStudio onNavigate={handleNavigate} />}
        {currentPage === 'photo-collage' && <PhotoCollageMaker onNavigate={handleNavigate} />}

        {currentPage === 'home' && (
          <>
            {/* If logged in, show Mobbin-Inspired Curated Dashboard Deck */}
            {currentUser && (() => {
              const activeName = currentUser.name || currentUser.full_name || currentUser.username || currentUser.email || 'User';
              const activeEmail = currentUser.email || currentUser.mail || 'No email linked';
              const userInitial = activeName.charAt(0).toUpperCase();

              return (
                <div className="mb-12 p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl relative overflow-hidden group transition-all duration-700 animate-fade-in">
                  
                  {/* Subtle Background Glow Accents */}
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700"></div>
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col gap-8">
                    
                    {/* Header Row: User Identity & Quick Meta */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                      
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-black text-2xl sm:text-3xl shadow-inner shadow-cyan-500/20 shrink-0 transform hover:scale-105 transition-transform duration-300">
                          {userInitial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold tracking-wider w-fit mb-2 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            AUTHENTICATED SESSION &bull; PRO SUITE
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">{activeName}</span>
                          </h2>
                          <p className="text-sm text-slate-400 mt-0.5">
                            {activeEmail} &bull; Explore curated tools and developer components below.
                          </p>
                        </div>
                      </div>

                      {/* Action Badges */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Tier</span>
                          <span className="text-xs font-bold text-emerald-400 mt-0.5">Verified Pro</span>
                        </div>

                        <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Access</span>
                          <span className="text-xs font-bold text-cyan-300 mt-0.5">All Unlocked</span>
                        </div>

                        <button 
                          onClick={() => setIsAccountOpen(true)}
                          className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer ml-auto lg:ml-0"
                        >
                          View Profile →
                        </button>
                      </div>

                    </div>

                    {/* Mobbin-Style Animated Gallery Carousel Deck */}
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                            Curated Inspiration & Highlights
                          </span>
                        </div>
                        {/* Slide Navigation Indicator Pills */}
                        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-full border border-slate-800/80">
                          {CURATED_SHOWCASE.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSlide(idx)}
                              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                activeSlide === idx ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-slate-700 hover:bg-slate-600'
                              }`}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Sliding Slides Container with Smooth Fade & Translate */}
                      <div className="relative min-h-[110px] sm:min-h-[96px] flex items-center">
                        {CURATED_SHOWCASE.map((item, idx) => (
                          <div
                            key={idx}
                            className={`w-full absolute inset-0 transition-all duration-700 ease-out flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 border border-slate-800/90 backdrop-blur-xl shadow-xl ${
                              activeSlide === idx 
                                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                                : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold tracking-wider uppercase">
                                  {item.badge}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400">
                                  &bull; {item.subtitle}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-900/50">
                                {item.stats}
                              </span>
                              <button
                                onClick={() => handleNavigate(item.slug)}
                                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-md"
                              >
                                View Item →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* Animated Hero Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span className="tracking-wide text-slate-300">Live Visitor Count:</span>
                <span className="font-mono font-bold text-white bg-cyan-500/20 px-2.5 py-0.5 rounded-md border border-cyan-400/30">
                  {visitCount}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                Discover UI Tools &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)] animate-pulse">
                  Workflows
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 dark:text-cyan-200/70">
                A high-performance suite of modern web development, media converter, and design utilities.
              </p>

              <div className="mt-8 max-w-xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Search tools, converters, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 dark:border-cyan-900/50 text-white placeholder-slate-500 dark:placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 shadow-xl shadow-cyan-950/30 text-sm"
                />
                <svg
                  className="w-5 h-5 text-slate-500 dark:text-cyan-400/60 absolute left-4 top-4.5 transition-transform duration-200 group-focus-within:scale-110 group-focus-within:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/30 scale-105'
                        : 'bg-slate-900/80 dark:bg-slate-950/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 border border-slate-800 dark:border-cyan-900/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  category={tool.category}
                  badge={tool.badge}
                  onClick={() => handleNavigate(tool.slug || 'home')}
                />
              ))}
            </div>

            <SupporterWall onOpenDonate={() => setIsDonateOpen(true)} />
          </>
        )}
      </main>

      <Footer onOpenDonate={() => setIsDonateOpen(true)} />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          setIsAuthOpen(false);
        }}
      />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} currentUser={currentUser} />
    </div>
  );
}