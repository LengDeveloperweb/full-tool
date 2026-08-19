import { useState } from 'react';
import abaQrImage from '../assets/abaQrImage.png';

export default function DonateModal({ isOpen, onClose }) {
  const [copiedAccount, setCopiedAccount] = useState('');

  const accountDetails = {
    name: 'MONGLENG CHAB',
    usdNumber: '004 684 852',
    khrNumber: '501 358 672',
  };

  if (!isOpen) return null;

  const handleCopy = (number, type) => {
    navigator.clipboard.writeText(number.replace(/\s+/g, ''));
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-center max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/40">
          Support LengTool
        </span>

        <h3 className="text-2xl font-black text-white mt-3">
          Donate via <span className="text-cyan-400">ABA Bank</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Scan with any KHQR-supported banking app to keep this project free & updated.
        </p>

        {/* KHQR Image Container */}
        <div className="my-5 p-2 bg-white rounded-2xl border-2 border-cyan-400/50 shadow-lg inline-block max-w-[240px]">
          <img
            src={abaQrImage} 
            alt="ABA KHQR Code - MONGLENG CHAB"
            className="w-full h-auto rounded-xl object-contain"
          />
        </div>

        {/* Account Details Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-3 mb-5">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/80">
            <span className="text-slate-400 font-medium">Account Name</span>
            <span className="text-white font-bold tracking-wide uppercase">{accountDetails.name}</span>
          </div>

          {/* USD Account */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400 font-medium block">USD Account</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">{accountDetails.usdNumber}</span>
            </div>
            <button
              onClick={() => handleCopy(accountDetails.usdNumber, 'USD')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-slate-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedAccount === 'USD' ? 'Copied USD!' : 'Copy USD'}
            </button>
          </div>

          {/* KHR Account */}
          <div className="flex justify-between items-center text-xs pt-1">
            <div>
              <span className="text-slate-400 font-medium block">KHR Account</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">{accountDetails.khrNumber}</span>
            </div>
            <button
              onClick={() => handleCopy(accountDetails.khrNumber, 'KHR')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-slate-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedAccount === 'KHR' ? 'Copied KHR!' : 'Copy KHR'}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Thank you for supporting LengTool!
        </p>
      </div>
    </div>
  );
}