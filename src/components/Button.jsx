export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles =
    'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-95';
  
  const variants = {
    primary:
      'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20',
    ghost:
      'text-slate-300 hover:text-white hover:bg-slate-800/50',
    outline:
      'text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}