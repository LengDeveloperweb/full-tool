import { useState, useEffect } from 'react';

export default function LuckyDrawMaker({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('wheel'); // 'wheel' | 'picker' | 'teams'

  // Wheel state
  const [namesInput, setNamesInput] = useState('Alice\nBob\nCharlie\nDiana\nEthan\nFiona\nGrace\nHank');
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Random Picker state
  const [pickerInput, setPickerInput] = useState('Prize 1: Airpods\nPrize 2: Mechanical Keyboard\nPrize 3: $50 Voucher\nGrand Prize: MacBook Air');
  const [pickedResult, setPickedResult] = useState(null);
  const [isPicking, setIsPicking] = useState(false);

  // Random Teams state
  const [teamMembersInput, setTeamMembersInput] = useState('Player 1\nPlayer 2\nPlayer 3\nPlayer 4\nPlayer 5\nPlayer 6\nPlayer 7\nPlayer 8');
  const [teamCount, setTeamCount] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState([]);

  // Spin Wheel logic
  const spinWheel = () => {
    if (isSpinning) return;
    const names = namesInput.split('\n').map(n => n.trim()).filter(Boolean);
    if (names.length < 2) {
      alert('Please enter at least 2 names to spin the wheel!');
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    const randomExtraDegrees = Math.floor(Math.random() * 360) + 2160; // At least 6 full rotations
    const newRotation = rotation + randomExtraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      const actualDeg = newRotation % 360;
      const sliceDeg = 360 / names.length;
      const winningIndex = Math.floor((360 - (actualDeg % 360)) / sliceDeg) % names.length;
      setWinner(names[winningIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  // Random Item Picker logic
  const pickRandom = () => {
    const items = pickerInput.split('\n').map(i => i.trim()).filter(Boolean);
    if (items.length === 0) {
      alert('Please enter items to pick from!');
      return;
    }

    setIsPicking(true);
    setPickedResult(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setPickedResult(items[randomIndex]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setIsPicking(false);
      }
    }, 80);
  };

  // Generate Teams logic
  const generateTeams = () => {
    const members = teamMembersInput.split('\n').map(m => m.trim()).filter(Boolean);
    if (members.length === 0) {
      alert('Please enter members to split into teams!');
      return;
    }

    const shuffled = [...members].sort(() => Math.random() - 0.5);
    const teams = Array.from({ length: teamCount }, () => []);

    shuffled.forEach((member, index) => {
      teams[index % teamCount].push(member);
    });

    setGeneratedTeams(teams);
  };

  const colors = [
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6'
  ];
  const namesList = namesInput.split('\n').map(n => n.trim()).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-[#07090e] text-slate-100 rounded-3xl border border-cyan-500/20 shadow-2xl animate-fade-in font-sans relative">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold tracking-wider w-fit mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            INTERACTIVE SUITE &bull; LUCKY DRAW
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Lucky Draw & Random Group Maker
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Spin the Wheel of Fortune, pick random winners, or split groups into balanced teams instantly.
          </p>
        </div>

        <button
          onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 w-fit">
        {[
          { id: 'wheel', label: '🎡 Spinning Wheel', desc: 'Wheel of Fortune' },
          { id: 'picker', label: '🎲 Random Picker', desc: 'Instant Draw' },
          { id: 'teams', label: '👥 Team Generator', desc: 'Group Splitter' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: SPINNING WHEEL ================= */}
      {activeTab === 'wheel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Wheel Graphic Container */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-3xl border border-slate-800/80 relative min-h-[440px] shadow-inner">
            
            {/* Top Triangular Indicator Pointer */}
            <div className="absolute top-4 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-cyan-400 drop-shadow-[0_4px_10px_rgba(34,211,238,0.5)]" />

            {/* Wheel Canvas / SVG */}
            <div className="relative p-3 rounded-full bg-slate-900/80 border-4 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
              <div
                className="w-72 h-72 sm:w-88 sm:h-88 rounded-full relative overflow-hidden transition-all ease-out shadow-2xl flex items-center justify-center bg-slate-950"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '4000ms' : '0ms'
                }}
              >
                {namesList.length > 0 ? (
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
                    {namesList.map((name, i) => {
                      const sliceAngle = 360 / namesList.length;
                      const angle = sliceAngle * i;
                      // Rotate text so it perfectly radiates outward through the center of each slice
                      const textRotation = angle + sliceAngle / 2;
                      const color = colors[i % colors.length];

                      return (
                        <g key={i}>
                          <path
                            d={`M50 50 L${50 + 50 * Math.sin((Math.PI * angle) / 180)} ${
                              50 - 50 * Math.cos((Math.PI * angle) / 180)
                            } A50 50 0 ${sliceAngle > 180 ? 1 : 0} 1 ${
                              50 + 50 * Math.sin((Math.PI * (angle + sliceAngle)) / 180)
                            } ${50 - 50 * Math.cos((Math.PI * (angle + sliceAngle)) / 180)} Z`}
                            fill={color}
                            stroke="#07090e"
                            strokeWidth="0.6"
                          />
                          <text
                            x="50"
                            y="23"
                            fill="#07090e"
                            fontSize="4.2"
                            fontWeight="800"
                            textAnchor="middle"
                            transform={`rotate(${textRotation} 50 50)`}
                            style={{ userSelect: 'none' }}
                          >
                            {name.length > 10 ? name.substring(0, 9) + '..' : name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <span className="text-xs text-slate-500">Add participants below</span>
                )}
              </div>

              {/* Center Wheel Hub Button Overlay */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950 border-4 border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300 font-black text-xs pointer-events-none">
                SPIN
              </div>
            </div>

            {/* Spin Controls & Winner Announcement */}
            <div className="mt-8 flex flex-col items-center gap-3 w-full">
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/25 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSpinning ? 'Spinning Wheel...' : 'SPIN THE WHEEL NOW'}
              </button>

              {winner && !isSpinning && (
                <div className="mt-2 px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-extrabold animate-bounce flex items-center gap-2">
                  <span>🏆 Winning Result:</span>
                  <span className="text-white bg-cyan-500/20 px-3 py-1 rounded-xl">{winner}</span>
                </div>
              )}
            </div>
          </div>

          {/* Participants Configuration Box */}
          <div className="lg:col-span-5 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Participants List</span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                  {namesList.length} total
                </span>
              </label>
              <button
                onClick={() => setNamesInput('')}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <textarea
              rows="10"
              value={namesInput}
              onChange={(e) => setNamesInput(e.target.value)}
              placeholder="Enter each name on a new line..."
              className="w-full p-4 rounded-2xl bg-[#04060a] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed shadow-inner"
            />
            <p className="text-[11px] text-slate-400">
              Tip: Add between 2 to 16 items for optimal wheel clarity. Each name takes an equal slice.
            </p>
          </div>

        </div>
      )}

      {/* ================= TAB 2: RANDOM PICKER ================= */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-3xl border border-slate-800/80 min-h-[400px] space-y-6 shadow-inner">
            <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-3">
                Selected Lucky Draw Item
              </span>
              <div className="text-3xl sm:text-4xl font-black text-cyan-300 min-h-[70px] flex items-center justify-center tracking-tight drop-shadow">
                {pickedResult || 'Ready to Draw!'}
              </div>
            </div>

            <button
              onClick={pickRandom}
              disabled={isPicking}
              className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/25 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isPicking ? 'Randomizing Items...' : 'PICK RANDOM WINNER'}
            </button>
          </div>

          <div className="lg:col-span-5 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 space-y-4 shadow-xl">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Prizes / Options (One per line)
            </label>
            <textarea
              rows="10"
              value={pickerInput}
              onChange={(e) => setPickerInput(e.target.value)}
              placeholder="Enter options here..."
              className="w-full p-4 rounded-2xl bg-[#04060a] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed shadow-inner"
            />
          </div>

        </div>
      )}

      {/* ================= TAB 3: TEAM GENERATOR ================= */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 space-y-5 shadow-xl">
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
                Team Members (One per line)
              </label>
              <textarea
                rows="7"
                value={teamMembersInput}
                onChange={(e) => setTeamMembersInput(e.target.value)}
                placeholder="Enter member names..."
                className="w-full p-4 rounded-2xl bg-[#04060a] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed shadow-inner"
              />
            </div>

            <div className="space-y-2 bg-[#04060a] p-4 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Number of Teams:</span>
                <span className="text-sm font-bold text-cyan-400 font-mono bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-800/50">
                  {teamCount} Teams
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={teamCount}
                onChange={(e) => setTeamCount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
            </div>

            <button
              onClick={generateTeams}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/25 cursor-pointer active:scale-95"
            >
              Generate Random Teams
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 min-h-[400px] shadow-xl">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center justify-between">
              <span>Balanced Team Breakdown</span>
              <span className="text-slate-400 text-[11px] font-normal">Shuffled automatically</span>
            </h3>

            {generatedTeams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedTeams.map((team, idx) => (
                  <div key={idx} className="bg-[#04060a] border border-slate-800/90 p-5 rounded-2xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                        Team {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">
                        {team.length} members
                      </span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                      {team.length > 0 ? (
                        team.map((member, mIdx) => (
                          <li key={mIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {member}
                          </li>
                        ))
                      ) : (
                        <span className="text-slate-600 text-[11px] italic">No members assigned</span>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-xs space-y-2">
                <svg className="w-10 h-10 text-slate-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Click "Generate Random Teams" to shuffle members instantly.</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}