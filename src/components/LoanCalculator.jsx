import { useState } from 'react';

export default function LoanCalculator({ onNavigate }) {
  // --- Loan Calculator States ---
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'KHR'
  const [exchangeRate] = useState(4050); // Standard reference rate
  const [loanAmount, setLoanAmount] = useState(30000); // Principal amount
  const [interestRate, setInterestRate] = useState(8.5); // Annual interest rate (%)
  const [loanTermYears, setLoanTermYears] = useState(15); // Term in years
  const [monthlyIncome, setMonthlyIncome] = useState(1200); // For Affordability / DSR check

  // Convert inputs to USD for standard calculation
  const principalUSD = currency === 'USD' ? loanAmount : loanAmount / exchangeRate;
  const incomeUSD = currency === 'USD' ? monthlyIncome : monthlyIncome / exchangeRate;

  // Monthly Interest Rate & Total Payments
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  // Monthly Payment Formula (Amortization)
  let monthlyPaymentUSD = 0;
  if (monthlyRate > 0) {
    monthlyPaymentUSD = (principalUSD * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else {
    monthlyPaymentUSD = principalUSD / (totalPayments || 1);
  }

  const totalPaymentUSD = monthlyPaymentUSD * totalPayments;
  const totalInterestUSD = totalPaymentUSD - principalUSD;

  // Debt Service Ratio (DSR) = Monthly Loan / Monthly Income
  const dsrRatio = incomeUSD > 0 ? (monthlyPaymentUSD / incomeUSD) * 100 : 0;

  // Formatter helper
  const formatAmount = (valUSD) => {
    if (currency === 'KHR') {
      const valKHR = valUSD * exchangeRate;
      return `${Math.round(valKHR).toLocaleString()} ៛`;
    }
    return `$${valUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">
              All Tools
            </button>
            <span>›</span>
            <span className="text-cyan-400 font-medium">Bank Loan & Mortgage Calculator</span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            ← Back to Tools
          </button>
        </div>

        {/* Studio Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-lg">
                🏦
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bank Loan & Amortization Studio
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate monthly loan installments, total interest charges, and evaluate debt affordability (DSR).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span>🏦</span> Loan Specifications
            </h2>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('KHR')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  currency === 'KHR' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                KHR (៛)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Loan Principal Amount ({currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all pr-10"
                  placeholder="Enter loan amount"
                />
                <span className="absolute right-4 top-3.5 text-slate-500 font-mono font-bold">
                  {currency === 'USD' ? '$' : '៛'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Monthly Net Income ({currency}) &bull; For DSR Check
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all pr-10"
                  placeholder="Enter monthly net salary"
                />
                <span className="absolute right-4 top-3.5 text-slate-500 font-mono font-bold">
                  {currency === 'USD' ? '$' : '៛'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Installment</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                  dsrRatio <= 40 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  DSR: {dsrRatio.toFixed(1)}% {dsrRatio <= 40 ? '(Safe)' : '(High Risk)'}
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300 font-mono tracking-tight">
                  {formatAmount(monthlyPaymentUSD)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated payment per month over {totalPayments} installments.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Principal Amount</span>
                  <span className="font-mono font-semibold text-white">{formatAmount(principalUSD)}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Interest Payable</span>
                  <span className="font-mono font-semibold text-amber-400">{formatAmount(totalInterestUSD)}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Lifetime Cost</span>
                  <span className="font-mono font-semibold text-cyan-300">{formatAmount(totalPaymentUSD)}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-slate-400 font-bold">Repayment Term</span>
                  <span className="font-mono font-bold text-white">{loanTermYears} Years ({totalPayments} months)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Standard Amortization Formula</span>
              <span>1 USD = {exchangeRate} KHR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}