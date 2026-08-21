import React, { useState, useEffect, useRef } from 'react';
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
import LuckyDrawMaker from './components/LuckyDrawMaker';
import KhmerDictionary from './components/KhmerDictionary';
import GradeCalculator from './components/GradeCalculator';
import SalaryTaxCalculator from './components/SalaryTaxCalculator';
import LoanCalculator from './components/LoanCalculator';
import ImageTools from './components/ImageTools';
import KhlaKhlouk from './components/KhlaKhlouk';

// Live Render backend URL configuration
const API_BASE_URL = 'https://full-tool.onrender.com';

const CATEGORIES = ['All', 'Media', 'Developer', 'Utility', 'Design', 'Text', 'Fun'];

const TOOLS_DATA = [
  { id: 1, slug: 'photo-collage', title: 'Photo Collage Maker', description: 'Combine photos, customize layouts, borders, and templates instantly.', category: 'Media', badge: 'Popular' },
  { id: 2, slug: 'pdf-studio', title: 'PDF Converter & Studio', description: 'Merge, split, compress, and convert PDF files directly in your browser.', category: 'Media', badge: 'Popular' },
  { id: 3, slug: 'qr-generator', title: 'QR Code Generator', description: 'Generate custom QR codes with custom colors and links.', category: 'Utility', badge: 'New' },
  { id: 4, slug: 'lucky-draw', title: 'Lucky Draw & Random Group Maker', description: 'Spinning Wheel of Fortune with physics & confetti, classroom/meeting random team generator, and dice & co...', category: 'Fun', badge: 'Popular' },
  { id: 5, slug: 'khmer-dictionary', title: 'Khmer Dictionary ( Chuon Nath )', description: 'Comprehensive Samdech Chuon Nath Khmer dictionary with 6,400+ words, definitions, pronunciations, and examples.', category: 'Text', badge: 'Khmer' },
  { id: 20, slug: 'grade-calculator', title: 'Grade & GPA Calculator', description: 'Calculate semester grade point averages, track subject credits, and manage academic performance.', category: 'Utility', badge: 'New' },
  { id: 8, slug: 'salary-tax', title: 'Salary Tax Calculator', description: 'Calculate Cambodian salary tax brackets, NSSF contributions, and resident tax liabilities easily.', category: 'Utility', badge: 'Khmer TAX' },
  { id: 21, slug: 'loan-calculator', title: 'Bank Loan & Mortgage Calculator', description: 'Calculate monthly loan installments, total interest charges, and evaluate debt affordability.', category: 'Utility', badge: 'New' },
  { id: 6, slug: 'image-tools', title: 'Image Compressor & Converter', description: 'Compress, optimize, and convert PNG, JPEG, and WebP images instantly in your browser.', category: 'Media', badge: 'New' },
  { id: 22, slug: 'khla-klouk', title: 'Khla Klouk (ខ្លាឃ្លោក)', description: 'Traditional Cambodian dice game with betting chips, animated shakes, and real-time payouts.', category: 'Fun', badge: 'Khmer Game' },
  { id: 9, slug: 'json-formatter', title: 'JSON Formatter', description: 'Validate, format, and beautify your JSON data instantly.', category: 'Developer' },
  { id: 10, slug: 'tailwind-color', title: 'Tailwind Color Converter', description: 'Convert RGB, HEX, and HSL colors into nearest Tailwind CSS color classes.', category: 'Design' },
  { id: 12, slug: 'base64', title: 'Base64 Encoder / Decoder', description: 'Encode or decode strings and binary data using standard Base64 format.', category: 'Developer' },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [visitCount, setVisitCount] = useState('...');
  
  const hasFetchedVisit = useRef(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [savedToolSlugs, setSavedToolSlugs] = useState(() => {
    try {
      const local = localStorage.getItem('lengtool_saved_utilities');
      return local ? JSON.parse(local) : ['qr-generator', 'pdf-studio'];
    } catch {
      return ['qr-generator', 'pdf-studio'];
    }
  });

  const toggleSaveTool = (slug) => {
    setSavedToolSlugs((prev) => {
      const updated = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem('lengtool_saved_utilities', JSON.stringify(updated));
      return updated;
    });
  };

  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch visit count and increment on load/mount
  const fetchVisits = async (increment = false) => {
    try {
      const endpoint = increment ? `${API_BASE_URL}/api/visits/increment` : `${API_BASE_URL}/api/visits`;
      let response = await fetch(endpoint).catch(() => null);
      
      // Fallback if specific increment endpoint doesn't exist
      if (!response || !response.ok) {
        response = await fetch(`${API_BASE_URL}/api/visits`);
      }

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data && (data.visit_count !== undefined || data.count !== undefined)) {
        setVisitCount(data.visit_count ?? data.count);
      } else {
        setVisitCount(prev => (typeof prev === 'number' ? prev + 1 : 1));
      }
    } catch (err) {
      console.error('Failed to update visit count:', err);
      // Client-side fallback increment if backend request fails
      setVisitCount(prev => (typeof prev === 'number' ? prev + 1 : 1));
    }
  };

  useEffect(() => {
    if (hasFetchedVisit.current) return;
    hasFetchedVisit.current = true;
    fetchVisits(false);
  }, []);

  useEffect(() => {
    document.title = 'lengtool';
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const savedToolsList = TOOLS_DATA.filter(t => savedToolSlugs.includes(t.slug));

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
        {currentPage === 'lucky-draw' && <LuckyDrawMaker onNavigate={handleNavigate} />}
        {currentPage === 'khla-klouk' && <KhlaKhlouk onNavigate={handleNavigate} />}
        {currentPage === 'khmer-dictionary' && <KhmerDictionary onNavigate={handleNavigate} />}
        {currentPage === 'grade-calculator' && <GradeCalculator onNavigate={handleNavigate} />}
        {currentPage === 'salary-tax' && <SalaryTaxCalculator onNavigate={handleNavigate} />}
        {currentPage === 'loan-calculator' && <LoanCalculator onNavigate={handleNavigate} />}
        {currentPage === 'image-tools' && <ImageTools onNavigate={handleNavigate} />}

        {currentPage === 'home' && (
          <>
            {savedToolsList.length > 0 && (
              <div className="mb-10 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <span>★</span> SAVED UTILITIES ({savedToolsList.length})
                  </div>
                  <button 
                    onClick={() => alert('All saved utilities are pinned to your local session.')}
                    className="text-xs font-semibold text-amber-400/80 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Open Saved Modal →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedToolsList.map((tool) => (
                    <div 
                      key={tool.slug}
                      onClick={() => handleNavigate(tool.slug)}
                      className="group relative bg-slate-950/80 hover:bg-slate-900 border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-4 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                          {tool.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {tool.title}
                          </h4>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveTool(tool.slug);
                        }}
                        className="text-amber-400 hover:text-amber-300 p-2 cursor-pointer transition-transform active:scale-90"
                        title="Remove saved"
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              {filteredTools.map((tool) => {
                const isSaved = savedToolSlugs.includes(tool.slug);
                return (
                  <div key={tool.id} className="relative group/card">
                    <ToolCard
                      title={tool.title}
                      description={tool.description}
                      category={tool.category}
                      badge={tool.badge}
                      onClick={() => handleNavigate(tool.slug || 'home')}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveTool(tool.slug);
                      }}
                      className={`absolute top-4 right-2 z-20 p-2 rounded-xl border transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-400 shadow-lg shadow-amber-500/20' 
                          : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-amber-400'
                      }`}
                      title={isSaved ? 'Remove from saved utilities' : 'Save utility'}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>
                );
              })}
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
          // Increment visitor count by 1 on successful login
          fetchVisits(true);
        }}
      />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} currentUser={currentUser} />
    </div>
  );
}