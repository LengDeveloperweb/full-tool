import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Info Card & Social Links */}
        <div className="md:col-span-5 bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-cyan-950/40">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              Get In Touch
            </span>
            <h2 className="text-3xl font-black text-white mt-4 tracking-tight">
              Let's talk about <span className="text-cyan-400">LengTool</span>
            </h2>
            <p className="text-sm text-slate-300 dark:text-cyan-200/70 mt-3 leading-relaxed">
              Have a suggestion, found a bug, or want to request a new tool? Drop us a message anytime!
            </p>
          </div>

          {/* Contact Methods & Social Accounts */}
          <div className="space-y-5 mt-8">
            {/* Telegram */}
            <a 
              href="https://t.me/lengdeveloper" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 group transition-all"
            >
              <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400 border border-slate-700/80 group-hover:border-cyan-400 group-hover:bg-cyan-400/10 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.68-.55.84-1.12.52l-3.05-2.25-1.47 1.42c-.16.16-.3.3-.62.3l.22-3.11 5.66-5.11c.25-.22-.05-.34-.38-.12l-7 4.41-3.01-.94c-.66-.21-.67-.66.14-.98l11.78-4.54c.55-.2 1.03.13.82.92z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Telegram</p>
                <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">@lengdevloper</p>
              </div>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/1DYa1yfBZy/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 group transition-all"
            >
              <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400 border border-slate-700/80 group-hover:border-cyan-400 group-hover:bg-cyan-400/10 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Facebook</p>
                <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">Chab Mongleng</p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400 border border-slate-700/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Email Us</p>
                <p className="text-sm font-semibold text-white">monglengchab18@gmail.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400 border border-slate-700/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                <p className="text-sm font-semibold text-white">Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 font-mono mt-6">
            Powered by Leng Community
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-sm text-slate-400 mt-2">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Tool Request / Feedback / Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us what you need help with..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-black hover:bg-cyan-300 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 text-sm tracking-wide"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}