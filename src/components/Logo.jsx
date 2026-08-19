

export default function Logo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-cyan-500/20">
        L
      </div>
      <span className="font-bold text-xl tracking-tight text-white">
        Leng<span className="text-cyan-400">Tool</span>
      </span>
    </div>
  );
}