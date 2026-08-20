import { useState } from 'react';

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Getting Started with LengTool</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          LengTool is a suite of web tools for frontend developers, UI designers, and digital creators. No complex installation or setup is required.
        </p>
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-900/40 font-mono text-xs text-cyan-300">
          // All operations run directly inside your browser client context.
        </div>
      </div>
    ),
  },
  {
    id: 'media-tools',
    title: 'Media Utilities',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Media Utilities</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Use the Image Compressor to optimize web graphics without losing resolution quality, or extract custom hex color palettes from reference assets.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
          <li>Supported image formats: PNG, JPG, WebP, and SVG.</li>
          <li>Export color swatches directly into Tailwind CSS classes.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Developer Tools</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Clean up raw JSON payloads, minify raw SVG markups, or encode base64 strings instantaneously.
        </p>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-cyan-400">const</span> formatJson = (data) =&#123; <span className="text-emerald-400">JSON</span>.stringify(data, <span className="text-amber-300">null</span>, 2); &#125;;
        </div>
      </div>
    ),
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <summary className="text-sm font-bold text-white">Is LengTool free to use?</summary>
            <p className="text-xs text-slate-400 mt-2">Yes, all tools are completely free without restrictions.</p>
          </details>
          <details className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <summary className="text-sm font-bold text-white">Is my data uploaded to a backend?</summary>
            <p className="text-xs text-slate-400 mt-2">No data leaves your device. Everything runs client-side in JS.</p>
          </details>
        </div>
      </div>
    ),
  },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const currentSection = DOC_SECTIONS.find((s) => s.id === activeTab);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/40">
          Documentation
        </span>
        <h2 className="text-4xl font-black text-white mt-3">LengTool Documentation</h2>
        <p className="text-sm text-slate-400 mt-1">Guides, usage notes, and technical breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl h-fit">
          {DOC_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === sec.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Main Content Viewer */}
        <div className="md:col-span-8 lg:col-span-9 bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-8 shadow-xl min-h-87.5">
          {currentSection?.content}
        </div>
      </div>
    </div>
  );
}