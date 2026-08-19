export default function ToolCard({ title, description, category, badge, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="animate-fade-in group relative rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 dark:border-cyan-900/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/60 cursor-pointer overflow-hidden"
    >
      
      {/* Subtle background gradient glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-700/60 dark:bg-slate-800 text-cyan-400 border border-cyan-500/20 transition-colors duration-200 group-hover:border-cyan-400/40">
            {category}
          </span>
          {badge && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/50 animate-pulse">
              {badge}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 relative z-10">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-300 dark:text-cyan-100/70 leading-relaxed relative z-10">
          {description}
        </p>
      </div>

      {/* Footer CTA with Animated Arrow */}
      <div className="mt-5 pt-4 border-t border-slate-700/50 dark:border-cyan-900/30 flex items-center justify-between text-xs font-semibold text-cyan-400 relative z-10">
        <span>Open Tool</span>
        <svg
          className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}