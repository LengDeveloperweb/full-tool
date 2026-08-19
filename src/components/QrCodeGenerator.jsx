import { useState, useEffect, useRef } from 'react';

export default function QrCodeGenerator({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('url');

  // Input states - url starts empty
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcard, setVcard] = useState({ name: '', phone: '', email: '', company: '' });
  const [email, setEmail] = useState({ address: '', subject: '', body: '' });
  const [sms, setSms] = useState({ phone: '', message: '' });

  // Customization states
  const [fgColor, setFgColor] = useState('#22d3ee');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [size, setSize] = useState(256);
  const canvasRef = useRef(null);

  const getQrData = () => {
    switch (activeTab) {
      case 'url':
        return url.trim() || 'https://example.com';
      case 'text':
        return text || 'Sample Text';
      case 'wifi':
        return `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.name}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nORG:${vcard.company}\nEND:VCARD`;
      case 'email':
        return `mailto:${email.address}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      case 'sms':
        return `smsto:${sms.phone}:${sms.message}`;
      default:
        return 'https://example.com';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const qrData = getQrData();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      qrData
    )}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, size, size);
    };
  }, [activeTab, url, text, wifi, vcard, email, sms, fgColor, bgColor, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Open preview window for mobile users so they can long-press and save to Photos
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Save QR Code</title></head>
              <body style="margin:0;background:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;color:#fff;font-family:sans-serif;padding:20px;text-align:center;">
                <p style="margin-bottom:15px;font-size:15px;line-height:1.4;">Long-press the QR code below and select <b>"Add to Photos"</b> or <b>"Download Image"</b></p>
                <img src="${dataUrl}" style="max-width:80%;max-height:60vh;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.5);background:#fff;padding:10px;" />
              </body>
            </html>
          `);
        } else {
          window.location.href = dataUrl;
        }
      } else {
        // Desktop standard automatic download link trigger
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode-${activeTab}-${Date.now()}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not export QR code image due to browser security restrictions.');
    }
  };

  const tabs = [
    {
      id: 'url',
      label: 'URL / Link',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      id: 'text',
      label: 'Plain Text',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
    {
      id: 'wifi',
      label: 'Wi-Fi Network',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
    },
    {
      id: 'vcard',
      label: 'Contact (vCard)',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 dark:border-cyan-900/40 rounded-2xl shadow-xl animate-fade-in">
      {/* Header with Back Button */}
      <div className="border-b border-slate-700 dark:border-cyan-900/40 pb-4 mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">QR Code</span> Generator
          </h2>
          <p className="text-sm text-slate-400 dark:text-cyan-100/70 mt-1">
            Create, customize, and download high-resolution QR codes for multiple data types.
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate ? onNavigate('home') : (window.location.hash = 'home')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-400 border border-slate-700 dark:border-cyan-900/50 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 active:scale-95 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Top Type Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 mb-8 bg-slate-900/90 rounded-2xl border border-slate-700/80 dark:border-cyan-900/40 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Dynamic Inputs Based on Tab */}
        <div className="space-y-5">
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Target URL / Link
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 transition-all text-sm"
              />
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Plain Text
              </label>
              <textarea
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter custom plain text content..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 transition-all text-sm resize-none"
              />
            </div>
          )}

          {activeTab === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                  placeholder="My Home Wi-Fi"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  placeholder="Network password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Encryption Type
                </label>
                <select
                  value={wifi.encryption}
                  onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'vcard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={vcard.name}
                  onChange={(e) => setVcard({ ...vcard, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={vcard.phone}
                  onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                  placeholder="+855 12 345 678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={vcard.email}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={vcard.company}
                  onChange={(e) => setVcard({ ...vcard, company: e.target.value })}
                  placeholder="Company Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email.address}
                  onChange={(e) => setEmail({ ...email, address: e.target.value })}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={email.subject}
                  onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                  placeholder="Inquiry Subject"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Body Message
                </label>
                <textarea
                  rows="3"
                  value={email.body}
                  onChange={(e) => setEmail({ ...email, body: e.target.value })}
                  placeholder="Pre-filled message..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={sms.phone}
                  onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                  placeholder="+855 12 345 678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                  Message
                </label>
                <textarea
                  rows="3"
                  value={sms.message}
                  onChange={(e) => setSms({ ...sms, message: e.target.value })}
                  placeholder="Enter SMS text..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 dark:border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Style Controls */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/60 dark:border-cyan-900/40">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Foreground Color
              </label>
              <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-700 dark:border-cyan-900/50">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-slate-300 font-mono uppercase">{fgColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-700 dark:border-cyan-900/50">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-slate-300 font-mono uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              Dimension ({size}x{size} px)
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Output Canvas Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-700/60 dark:border-cyan-900/40 sticky top-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-950/50">
            <canvas ref={canvasRef} width={size} height={size} className="rounded-lg max-w-full h-auto" />
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 w-full max-w-xs py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 active:scale-95 cursor-pointer"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}