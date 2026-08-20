export default function AccountModal({ isOpen, onClose, currentUser }) {
  if (!isOpen || !currentUser) return null;

  // Automatically detect and fall back to alternative property names from backend responses
  const displayName = currentUser.name || currentUser.full_name || currentUser.username || currentUser.email || 'User';
  const displayEmail = currentUser.email || currentUser.mail || 'No email provided';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow decorative effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
              {initial}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Profile</h3>
              <p className="text-xs text-slate-400">Manage your LengTool account credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body Details */}
        <div className="mt-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 block font-medium">Full Name</span>
            <span className="text-sm font-bold text-cyan-300">{displayName}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 block font-medium">Email Address</span>
            <span className="text-sm font-bold text-cyan-300">{displayEmail}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block font-medium">Account Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                ● Verified & Secure
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block font-medium">Member Access</span>
              <span className="text-xs font-bold text-cyan-400 mt-1 block">Standard Pro</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}