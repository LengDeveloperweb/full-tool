
export default function NavLink({ href, active, onClick, children, mobile }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`transition-all duration-200 cursor-pointer font-medium text-sm ${
        mobile
          ? `block px-3 py-2 rounded-lg ${
              active
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
            }`
          : `relative py-1 ${
              active
                ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                : 'text-slate-300 hover:text-cyan-400'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-400 after:rounded-full after:transition-transform after:duration-300 ${
              active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`
      }`}
    >
      {children}
    </a>
  );
}