import { useState, useEffect } from 'react';

export default function UserDashboard({ userName = 'User', userEmail = '' }) {
  // State and effect for the live visitor count
  const [visitorCount, setVisitorCount] = useState(1240);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('lengtool_session_counted');
    let currentCount = parseInt(localStorage.getItem('lengtool_visitor_count') || '1240', 10);

    if (!hasVisited) {
      currentCount += 1;
      localStorage.setItem('lengtool_visitor_count', currentCount.toString());
      sessionStorage.setItem('lengtool_session_counted', 'true');
    }

    setVisitorCount(currentCount);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-[#0a0f1d] text-slate-100 rounded-3xl border border-slate-800/80 shadow-2xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest mb-1">
            Session Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {userEmail || 'Manage your workspace and track activity below.'}
          </p>
        </div>

        {/* Live Visitor Count Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070b14] border border-cyan-500/30 text-xs text-slate-300 shadow-lg self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Live Visitor Count:</span>
          <span className="font-mono font-bold text-cyan-400">
            {visitorCount.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Quick summary cards or features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-[#0f172a]/70 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Account Status</p>
          <span className="text-xl font-bold text-emerald-400">Verified & Secure</span>
        </div>
      </div>
    </div>
  );
}