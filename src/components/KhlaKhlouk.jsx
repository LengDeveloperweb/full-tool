import React, { useState } from 'react';

// Traditional 6 symbols of Khla Klouk (Fish, Crab, Prawn, Rooster, Tiger, Gourd)
const SYMBOLS = [
  { id: 'fish', name: 'Fish', khmer: 'ត្រី', icon: '🐟', color: 'from-blue-500 to-cyan-600', border: 'border-cyan-500/40' },
  { id: 'crab', name: 'Crab', khmer: 'ក្តាម', icon: '🦀', color: 'from-red-500 to-rose-600', border: 'border-rose-500/40' },
  { id: 'prawn', name: 'Prawn', khmer: 'បង្គា', icon: '🦐', color: 'from-orange-500 to-amber-600', border: 'border-amber-500/40' },
  { id: 'rooster', name: 'Rooster', khmer: 'មាន់', icon: '🐓', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500/40' },
  { id: 'tiger', name: 'Tiger', khmer: 'ខ្លា', icon: '🐅', color: 'from-amber-600 to-stone-700', border: 'border-amber-600/40' },
  { id: 'gourd', name: 'Gourd', khmer: 'ល្ពៅ', icon: '🍈', color: 'from-emerald-500 to-green-700', border: 'border-emerald-500/40' },
];

const CHIP_VALUES = [1, 5, 10, 50, 100];

export default function KhlaKhlouk({ onNavigate }) {
  const [balance, setBalance] = useState(500);
  const [selectedChip, setSelectedChip] = useState(10);
  const [bets, setBets] = useState({ fish: 0, crab: 0, prawn: 0, rooster: 0, tiger: 0, gourd: 0 });
  const [dice, setDice] = useState(['tiger', 'fish', 'gourd']);
  const [isRolling, setIsRolling] = useState(false);
  const [roundMessage, setRoundMessage] = useState('Place your bets and shake the dice!');
  const [lastWin, setLastWin] = useState(0);

  const handlePlaceBet = (symbolId) => {
    if (balance < selectedChip) {
      alert("Insufficient balance! Collect more or reset.");
      return;
    }
    setBalance(prev => prev - selectedChip);
    setBets(prev => ({ ...prev, [symbolId]: prev[symbolId] + selectedChip }));
    setRoundMessage('Bets placed. Ready to roll!');
  };

  const handleClearBets = () => {
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    setBalance(prev => prev + totalBet);
    setBets({ fish: 0, crab: 0, prawn: 0, rooster: 0, tiger: 0, gourd: 0 });
    setRoundMessage('Bets cleared.');
  };

  const handleRollDice = () => {
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
      alert("Please place at least one bet before rolling!");
      return;
    }

    setIsRolling(true);
    setRoundMessage('Rolling the dice...');

    setTimeout(() => {
      // Randomly pick 3 dice outcomes
      const newDice = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id,
      ];
      setDice(newDice);
      setIsRolling(false);

      // Calculate payout
      let winnings = 0;
      let matchesSummary = [];

      Object.entries(bets).forEach(([symbolId, betAmount]) => {
        if (betAmount > 0) {
          const matchCount = newDice.filter(d => d === symbolId).length;
          if (matchCount > 0) {
            // Standard payout: Return original bet * matches + bonus multiplier
            winnings += betAmount + (betAmount * matchCount);
            matchesSummary.push(`${matchCount}x ${symbolId}`);
          }
        }
      });

      setLastWin(winnings);
      setBalance(prev => prev + winnings);

      if (winnings > 0) {
        setRoundMessage(`🎉 You Won $${winnings}! Matches: ${matchesSummary.join(', ')}`);
      } else {
        setRoundMessage(`😢 House wins this round. Try again!`);
      }

      // Reset bets for the next round
      setBets({ fish: 0, crab: 0, prawn: 0, rooster: 0, tiger: 0, gourd: 0 });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Navigation & Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl">
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
        >
          ← Back to Utilities
        </button>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
            🎲 <span>Khla Klouk (ខ្លាឃ្លោក)</span>
          </h1>
          <p className="text-xs text-slate-400">Traditional Cambodian Dice Game</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-sm">
          Balance: ${balance}
        </div>
      </div>

      {/* Dice Arena Box */}
      <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>

        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
          {roundMessage}
        </p>

        {/* 3 Dice Display */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 my-6">
          {dice.map((dieId, idx) => {
            const sym = SYMBOLS.find(s => s.id === dieId);
            return (
              <div
                key={idx}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${sym.color} border-2 ${sym.border} flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ${
                  isRolling ? 'animate-spin scale-95 opacity-50' : 'scale-100 opacity-100'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{sym.icon}</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1">{sym.khmer}</span>
              </div>
            );
          })}
        </div>

        {/* Roll & Control Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={handleRollDice}
            disabled={isRolling}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isRolling ? 'Shaking Dice...' : '🎲 SHAKE & ROLL'}
          </button>
          <button
            onClick={handleClearBets}
            className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            Clear Bets
          </button>
        </div>
      </div>

      {/* Betting Board (6 Symbols) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 text-center">
          Place Your Bets on the Board
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SYMBOLS.map((sym) => {
            const currentBet = bets[sym.id];
            return (
              <div
                key={sym.id}
                onClick={() => handlePlaceBet(sym.id)}
                className={`group relative bg-slate-950/80 hover:bg-slate-900 border-2 ${sym.border} rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sym.color} flex items-center justify-center text-2xl shadow-inner`}>
                  {sym.icon}
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {sym.name} ({sym.khmer})
                  </h4>
                </div>

                {currentBet > 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md animate-bounce">
                    ${currentBet}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chip Denominations Selector */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Chip Value:
          </span>
          <div className="flex items-center gap-2">
            {CHIP_VALUES.map((val) => (
              <button
                key={val}
                onClick={() => setSelectedChip(val)}
                className={`w-12 h-12 rounded-full font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  selectedChip === val
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-110'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}