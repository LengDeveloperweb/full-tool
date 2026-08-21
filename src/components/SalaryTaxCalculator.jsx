import { useState } from 'react';

export default function SalaryTaxCalculator({ onNavigate }) {
  // Inputs
  const [currency, setCurrency] = useState('KHR'); // 'KHR' or 'USD'
  const [exchangeRate] = useState(4000); // Standard GDT reference 1 USD = 4,000 KHR
  const [grossSalary, setGrossSalary] = useState(4000000); // Default 4M KHR (~$1,000)
  const [residency, setResidency] = useState('resident'); // 'resident' or 'non-resident'
  const [spouse, setSpouse] = useState(false); // Non-working spouse
  const [dependents, setDependents] = useState(0); // Dependent children under 14 or students under 25

  // Convert current input to KHR for calculation
  const grossInKHR = currency === 'USD' ? grossSalary * exchangeRate : grossSalary;

  // 1. NSSF Calculation (Employee Pension Contribution: 2% of gross salary)
  const nssfEmployee = residency === 'resident' ? Math.min(grossInKHR * 0.02, 120000) : 0;

  // 2. Family Deductions for Residents (KHR 150,000 per dependent spouse / child per month)
  const spouseDeduction = residency === 'resident' && spouse ? 150000 : 0;
  const dependentDeduction = residency === 'resident' ? dependents * 150000 : 0;
  const totalFamilyDeduction = spouseDeduction + dependentDeduction;

  // 3. Taxable Salary
  const netTaxableBase = Math.max(0, grossInKHR - nssfEmployee - totalFamilyDeduction);

  // 4. Tax Calculation
  let monthlyTaxKHR = 0;
  let effectiveBracket = '0% (0 - 1.5M KHR)';

  if (residency === 'non-resident') {
    monthlyTaxKHR = grossInKHR * 0.20;
    effectiveBracket = 'Flat 20% (Non-Resident)';
  } else {
    if (netTaxableBase <= 1500000) {
      monthlyTaxKHR = 0;
      effectiveBracket = '0% (0 - 1.5M KHR)';
    } else if (netTaxableBase <= 2000000) {
      monthlyTaxKHR = (netTaxableBase * 0.05) - 75000;
      effectiveBracket = '5% (1.5M - 2M KHR)';
    } else if (netTaxableBase <= 8500000) {
      monthlyTaxKHR = (netTaxableBase * 0.10) - 175000;
      effectiveBracket = '10% (2M - 8.5M KHR)';
    } else if (netTaxableBase <= 12500000) {
      monthlyTaxKHR = (netTaxableBase * 0.15) - 600000;
      effectiveBracket = '15% (8.5M - 12.5M KHR)';
    } else {
      monthlyTaxKHR = (netTaxableBase * 0.20) - 1225000;
      effectiveBracket = '20% (Over 12.5M KHR)';
    }
  }

  // 5. Net Take-Home Salary
  const netSalaryKHR = grossInKHR - nssfEmployee - monthlyTaxKHR;

  // Formatter helper
  const formatMoney = (amountInKHR) => {
    if (currency === 'USD') {
      const valUSD = amountInKHR / exchangeRate;
      return `$${valUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${Math.round(amountInKHR).toLocaleString()} KHR`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-cyan-400 font-medium">Salary Tax Calculator</span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            ← Back to Tools
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🇰🇭</span> Cambodia Salary Tax Calculator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Calculate monthly Tax on Salary (ToS), NSSF pension deductions, and take-home pay based on GDT regulations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setCurrency('KHR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'KHR' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              KHR (៛)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-cyan-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Salary & Employment Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gross Monthly Salary ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-mono font-bold">
                  {currency === 'USD' ? '$' : '៛'}
                </span>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-white font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="Enter monthly salary"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Includes basic salary, fixed allowances, bonuses, and taxable fringe benefits.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tax Residency Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResidency('resident')}
                  className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    residency === 'resident'
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Resident Taxpayer</span>
                  <span className="text-[10px] opacity-70 font-normal">Progressive Rates (0% - 20%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResidency('non-resident')}
                  className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    residency === 'non-resident'
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Non-Resident</span>
                  <span className="text-[10px] opacity-70 font-normal">Flat 20% Final Tax</span>
                </button>
              </div>
            </div>

            {residency === 'resident' && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fade-in">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Family Relief Deductions (150,000 KHR / person)
                </span>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Dependent Spouse</h4>
                    <p className="text-[11px] text-slate-400">Non-working husband or wife</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={spouse}
                    onChange={(e) => setSpouse(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Dependent Children / Students</h4>
                    <p className="text-[11px] text-slate-400">Under 14 years old or full-time students under 25</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDependents(Math.max(0, dependents - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-800 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-4 text-center">{dependents}</span>
                    <button
                      type="button"
                      onClick={() => setDependents(dependents + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Take-Home Salary</span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Verified Breakdown
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300 font-mono tracking-tight">
                  {formatMoney(netSalaryKHR)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Monthly payout after tax and mandatory NSSF deductions.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Gross Monthly Salary</span>
                  <span className="font-mono font-semibold text-white">{formatMoney(grossInKHR)}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">NSSF Contribution (2%)</span>
                  <span className="font-mono font-semibold text-amber-400">-{formatMoney(nssfEmployee)}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Family Deductions</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {residency === 'resident' ? `-${formatMoney(totalFamilyDeduction)}` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Tax Bracket Applied</span>
                  <span className="font-mono font-semibold text-cyan-300">{effectiveBracket}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-slate-400 font-bold">Monthly Tax Owed (ToS)</span>
                  <span className="font-mono font-bold text-rose-400">-{formatMoney(monthlyTaxKHR)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Exchange rate: 1 USD = {exchangeRate} KHR</span>
              <span>GDT Cambodia Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Brackets Info Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Resident Monthly Tax Brackets Reference (Sub-Decree No. 196)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Taxable Salary Range (KHR)</th>
                <th className="py-3 px-4">Tax Rate</th>
                <th className="py-3 px-4">Cumulative Deduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-3 px-4">0 – 1,500,000</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">0%</td>
                <td className="py-3 px-4">0 KHR</td>
              </tr>
              <tr>
                <td className="py-3 px-4">1,500,001 – 2,000,000</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">5%</td>
                <td className="py-3 px-4">75,000 KHR</td>
              </tr>
              <tr>
                <td className="py-3 px-4">2,000,001 – 8,500,000</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">10%</td>
                <td className="py-3 px-4">175,000 KHR</td>
              </tr>
              <tr>
                <td className="py-3 px-4">8,500,001 – 12,500,000</td>
                <td className="py-3 px-4 text-amber-400 font-bold">15%</td>
                <td className="py-3 px-4">600,000 KHR</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Over 12,500,000</td>
                <td className="py-3 px-4 text-rose-400 font-bold">20%</td>
                <td className="py-3 px-4">1,225,000 KHR</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}