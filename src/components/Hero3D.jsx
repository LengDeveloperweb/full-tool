import { useState, useRef } from 'react';

export default function Hero3D({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const [rotateStyle, setRotateStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  const containerRef = useRef(null);

  // Smooth 3D tilt effect on mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation angles (capped for subtle depth)
    const rotateX = (-y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;

    setRotateStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setRotateStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out',
    });
  };

  const categories = ['All', 'Media', 'Developer', 'Utility', 'Design', 'Text'];

  return (
    <div className="relative pt-12 pb-20 px-4 overflow-hidden">
      {/* 3D Immersive Background Ambiance Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Interactive 3D Tilt Wrapper Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={rotateStyle}
        className="max-w-4xl mx-auto text-center relative z-10 transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Live Visitor Count Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-slate-900/80 border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Live Visitor Count:</span>
          <span className="text-white font-mono font-bold bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">70</span>
        </div>

        {/* 3D Extruded Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          Discover UI Tools & <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            Workflows
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 mt-4 max-w-2xl mx-auto font-medium">
          A high-performance suite of modern web development, media converter, and design utilities.
        </p>

        {/* 3D Floating Search Box */}
        <div className="mt-8 max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
          
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl">
            <svg className="w-5 h-5 text-cyan-400 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, converters, or categories..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills with 3D Depth */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_5px_15px_rgba(6,182,212,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 hover:scale-102'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}