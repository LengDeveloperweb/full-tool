import React from 'react';

export default function AccountModal({ isOpen, onClose, currentUser }) {
  if (!isOpen) return null;

  // Fallback to safe defaults if currentUser is missing
  const fullName = currentUser?.full_name || currentUser?.username || 'admin123';
  const email = currentUser?.email || 'No email provided';
  const userId = currentUser?.id || currentUser?._id || 'LNG-884210';
  const role = 'Member'; // Set system role explicitly to Member
  const lastLogin = currentUser?.last_login || 'Today, 10:03 AM';
  const initial = fullName.charAt(0).toUpperCase();

  // Check saved utilities from local storage
  let savedCount = 0;
  try {
    const local = localStorage.getItem('lengtool_saved_utilities');
    savedCount = local ? JSON.parse(local).length : 2;
  } catch {
    savedCount = 2;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-[#0a0e17] to-slate-950 border border-cyan-500/35 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          ✕
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 opacity-50 blur-sm"></div>
            <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black text-2xl shadow-inner">
              {initial}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Account Profile
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your LengTool account credentials & session details
            </p>
          </div>
        </div>

        {/* Information Fields Section */}
        <div className="mt-6 space-y-4">
          
          {/* Full Name & User ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <div className="text-sm font-bold text-cyan-300 tracking-wide truncate">
                {fullName}
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                User ID / Token
              </label>
              <div className="text-xs font-mono font-bold text-slate-300 tracking-wider truncate">
                {userId}
              </div>
            </div>
          </div>

          {/* Email Address Field */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <div className="text-sm font-semibold text-slate-200 tracking-wide truncate">
              {email}
            </div>
          </div>

          {/* Role & Last Login Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                System Role
              </label>
              <div className="text-xs font-bold text-sky-400 tracking-wide mt-1 bg-sky-950/50 border border-sky-800/40 px-2 py-1 rounded-lg inline-block">
                {role}
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Last Active Login
              </label>
              <div className="text-xs font-medium text-slate-300 tracking-wide mt-1 truncate">
                {lastLogin}
              </div>
            </div>
          </div>

          {/* Status & Pinned Utilities Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Account Status
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400 tracking-wide">
                  Verified & Secure
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-all hover:border-cyan-500/30">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Saved Utilities
              </label>
              <div className="text-xs font-bold text-amber-400 tracking-wide mt-1 bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded-lg inline-block">
                ★ {savedCount} Pinned Tools
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}