import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import ContactPage from './components/ContactPage';
import FeaturesPage from './components/FeaturesPage';
import DocsPage from './components/DocsPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DonateModal from './components/DonateModal';
import SupporterWall from './components/SupporterWall';
import QrCodeGenerator from './components/QrCodeGenerator';
import PdfStudio from './components/PdfStudio';
import PhotoCollageMaker from './components/PhotoCollageMaker';

const CATEGORIES = ['All', 'Media', 'Developer', 'Utility', 'Design', 'Text'];

const TOOLS_DATA = [
  // Updated First 2 Cards
  { id: 1, slug: 'photo-collage', title: 'Photo Collage Maker', description: 'Combine photos, customize layouts, borders, and templates instantly.', category: 'Media', badge: 'Popular' },
  { id: 2, slug: 'pdf-studio', title: 'PDF Converter & Studio', description: 'Merge, split, compress, and convert PDF files directly in your browser.', category: 'Media', badge: 'Popular' },
  { id: 3, slug: 'qr-generator', title: 'QR Code Generator', description: 'Generate custom QR codes with custom colors and links.', category: 'Utility', badge: 'New' },
  { id: 4, slug: 'css-gradient', title: 'CSS Gradient Generator', description: 'Create modern background gradients and copy Tailwind CSS code.', category: 'Design' },
  { id: 5, slug: 'svg-minifier', title: 'SVG Minifier', description: 'Optimize and clean up raw SVG markup for web production.', category: 'Developer' },
  { id: 6, slug: 'text-case', title: 'Text Case Converter', description: 'Convert text strings to UPPERCASE, lowercase, camelCase, and titlecase.', category: 'Text' },

  // Remaining Tools
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

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Sets browser tab title to "lengtool"
  useEffect(() => {
    document.title = 'lengtool';
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Reloads page completely
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
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-cyan-50 transition-colors duration-300">
      <Navbar
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onBrandClick={handleRefresh}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'docs' && <DocsPage />}
        
        {/* Pass onNavigate handler to tool components */}
        {currentPage === 'qr-generator' && <QrCodeGenerator onNavigate={handleNavigate} />}
        {currentPage === 'pdf-studio' && <PdfStudio onNavigate={handleNavigate} />}
        {currentPage === 'photo-collage' && <PhotoCollageMaker onNavigate={handleNavigate} />}

        {currentPage === 'home' && (
          <>
            {/* Animated Hero Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Welcome to{' '}
                <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse">
                  LengTool
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 dark:text-cyan-200/70">
                A fast, modern suite of free web developer and design tools built to streamline your workflow.
              </p>

              {/* Glow-on-focus Search Bar */}
              <div className="mt-8 max-w-xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Search tools or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 rounded-xl bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white placeholder-slate-400 dark:placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all duration-300 shadow-lg shadow-cyan-950/30 text-sm"
                />
                <svg
                  className="w-5 h-5 text-slate-400 dark:text-cyan-400/60 absolute left-4 top-4 transition-transform duration-200 group-focus-within:scale-110 group-focus-within:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Filter Pills with Active Scaling */}
              <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/30 scale-105'
                        : 'bg-slate-800/80 dark:bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 border border-slate-700 dark:border-cyan-900/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool Cards Grid: 1 card on mobile, 2 cards on tablet (md), 3 cards on desktop (lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

            {/* Supporter Wall */}
            <SupporterWall onOpenDonate={() => setIsDonateOpen(true)} />
          </>
        )}
      </main>

      <Footer onOpenDonate={() => setIsDonateOpen(true)} />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}