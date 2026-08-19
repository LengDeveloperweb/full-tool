import { useState } from 'react';

const SUPPORTERS_DATA = [
  {
    id: 1,
    initial: 'C',
    name: 'Chab Mongleng',
    location: 'Phnom Penh',
    time: '10 mins ago',
    amount: '$5.00',
    badge: 'Top Supporter',
    quote: '"Small donation to encourage the dev team!"',
  },
  {
    id: 2,
    initial: 'N',
    name: 'NakXBroV',
    location: 'Phnom Penh',
    time: '45 mins ago',
    amount: '$2.00',
    badge: 'Recent Donor',
    quote: '"Super smooth tools, love the Khmer language support!"',
  },
  {
    id: 3,
    initial: 'B',
    name: 'BroVeng82',
    location: 'Phnom Penh',
    time: '2 hours ago',
    amount: '$1.50',
    badge: 'Recent Donor',
    quote: '"Thanks for keeping these utilities free!"',
  },
];

export default function SupporterWall({ onOpenDonate }) {
  const [tab, setTab] = useState('recent');

  return (
    <section className="mt-16 bg-slate-900/80 dark:bg-slate-900/60 border border-slate-800 dark:border-cyan-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <span>♡</span> Community Supporter Wall
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            LengTool Supporters & Donors
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
            Huge thanks to our community supporters who keep LengTool 100% free and fast!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-medium">
            <button
              onClick={() => setTab('recent')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'recent'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🕒 Recent Donations
            </button>
            <button
              onClick={() => setTab('top')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'top'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏆 Top Supporters
            </button>
          </div>

          <button
            onClick={onOpenDonate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          >
            <span>♥</span> Donate KHQR
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTERS_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/40 dark:bg-slate-950/40 border border-slate-700/50 dark:border-slate-800/80 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {item.initial}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-slate-100">{item.name}</span>
                    <span className="text-cyan-400 text-xs">✓</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {item.location} • {item.time}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-cyan-400 font-mono">
                  {item.amount}
                </span>
                <div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs italic text-slate-300/80 leading-relaxed">
              {item.quote}
            </p>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-center mt-8">
        <button
          onClick={onOpenDonate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all hover:border-cyan-500/40 cursor-pointer"
        >
          <span>👥</span> See All Supporters (3) <span>›</span>
        </button>
      </div>

      {/* KHQR Banner Box */}
      <div className="mt-8 bg-slate-800/90 dark:bg-slate-950/80 border border-slate-700/80 dark:border-cyan-900/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            ♥
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Want your name featured on the LengTool Supporter Wall?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Every small donation ($1, $2, or any amount) helps keep LengTool free and online for everyone!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDonate}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          View KHQR Code
        </button>
      </div>
    </section>
  );
}