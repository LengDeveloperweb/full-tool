import { useState, useRef } from 'react';

export default function PhotoCollageMaker({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('layout'); // 'layout' | 'style' | 'photos' | 'caption'
  const [images, setImages] = useState([]);
  const [slotImages, setSlotImages] = useState({}); // Maps slot index to image object: { 0: imgObj, 1: imgObj }
  const [slotCount, setSlotCount] = useState(4); // 2p, 3p, 4p, 5p, 6p
  const [selectedLayoutId, setSelectedLayoutId] = useState('grid-4-equal');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1', '4:5', '9:16', '16:9', '3:2'
  
  // Styling options (Cyan theme match)
  const [gap, setGap] = useState(12);
  const [borderRadius, setBorderRadius] = useState(16);
  const [bgColor, setBgColor] = useState('#0a0f1d');
  const [padding, setPadding] = useState(16);
  
  // Caption options
  const [captionText, setCaptionText] = useState('');
  const [captionPosition, setCaptionPosition] = useState('bottom');
  const [isExporting, setIsExporting] = useState(false);

  // Mobile Download Modal State
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState(null);

  const canvasRef = useRef(null);
  const activeUploadSlotRef = useRef(null);

  // Handle general image upload (adds to pool & auto-assigns to next empty slot)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      const newSlotImages = { ...slotImages };
      let fileIdx = 0;
      for (let i = 0; i < slotCount; i++) {
        if (!newSlotImages[i] && fileIdx < updated.length) {
          newSlotImages[i] = updated[fileIdx];
          fileIdx++;
        }
      }
      setSlotImages(newSlotImages);
      return updated;
    });
  };

  // Handle uploading specifically to a single slot
  const handleSlotSpecificUpload = (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImg = {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    };

    setImages((prev) => [...prev, newImg]);
    setSlotImages((prev) => ({
      ...prev,
      [slotIndex]: newImg,
    }));
  };

  const removeSlotImage = (slotIndex) => {
    setSlotImages((prev) => {
      const copy = { ...prev };
      delete copy[slotIndex];
      return copy;
    });
  };

  const removeImageFromPool = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const LAYOUTS = {
    2: [{ id: 'split-h', name: '2 Split Horizontal' }, { id: 'split-v', name: '2 Split Vertical' }],
    3: [{ id: 'hero-2-small', name: '1 Big + 2 Small' }, { id: '3-cols', name: '3 Columns Side-by-Side' }, { id: '3-rows', name: '3 Rows Stacked' }],
    4: [{ id: 'grid-4-equal', name: '4 Equal Grid Matrix' }, { id: '4-vertical', name: '4 Vertical Strips' }],
    5: [{ id: 'hero-4-side', name: '1 Hero + 4 Side Grid' }],
    6: [{ id: 'grid-6-equal', name: '6 Equal Grid Matrix' }, { id: '6-vertical', name: '6 Vertical Columns' }],
  };

  const currentLayouts = LAYOUTS[slotCount] || LAYOUTS[4];

  const getAspectRatioDimensions = () => {
    switch (aspectRatio) {
      case '4:5': return { w: 1080, h: 1350 };
      case '9:16': return { w: 1080, h: 1920 };
      case '16:9': return { w: 1920, h: 1080 };
      case '3:2': return { w: 1200, h: 800 };
      case '1:1':
      default:
        return { w: 1200, h: 1200 };
    }
  };

  const handleDownloadCollage = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { w: width, h: height } = getAspectRatioDimensions();
      canvas.width = width;
      canvas.height = height;

      // Fill Background Frame
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Pre-load slot images
      const loadedSlotImages = {};
      await Promise.all(
        Object.entries(slotImages).map(
          ([idx, imgObj]) =>
            new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                loadedSlotImages[idx] = img;
                resolve();
              };
              img.onerror = () => resolve(); // Prevent hanging if load fails
              img.src = imgObj.url;
            })
        )
      );

      const p = padding * 2;
      const r = borderRadius * 2;
      const innerW = width - p * 2;
      const innerH = height - p * 2 - (captionText ? 80 : 0);

      const drawImageCover = (img, x, y, w, h) => {
        if (!img) {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
          else ctx.rect(x, y, w, h);
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Empty Slot', x + w / 2, y + h / 2);
          return;
        }

        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
        else ctx.rect(x, y, w, h);
        ctx.clip();

        const imgRatio = img.width / img.height;
        const boxRatio = w / h;
        let dw = w, dh = h, dx = x, dy = y;

        if (imgRatio > boxRatio) {
          dw = h * imgRatio;
          dx = x - (dw - w) / 2;
        } else {
          dh = w / imgRatio;
          dy = y - (dh - h) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      };

      const startY = captionText && captionPosition === 'top' ? p + 80 : p;
      const usableH = innerH;

      const cols = slotCount === 3 || slotCount === 6 || slotCount === 5 ? 3 : slotCount === 2 ? 2 : 2;
      const rows = slotCount === 6 || slotCount === 5 || slotCount === 3 ? 2 : slotCount === 2 ? 1 : 2;
      
      const cellW = (innerW - gap * 2 * (cols - 1)) / cols;
      const cellH = (usableH - gap * 2 * (rows - 1)) / rows;

      for (let i = 0; i < slotCount; i++) {
        const c = i % cols;
        const row = Math.floor(i / cols);
        const x = p + c * (cellW + gap * 2);
        const y = startY + row * (cellH + gap * 2);
        drawImageCover(loadedSlotImages[i], x, y, cellW, cellH);
      }

      // Draw Caption
      if (captionText) {
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        const capY = captionPosition === 'top' ? p + 40 : height - p - 20;
        ctx.fillText(captionText, width / 2, capY);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Show in-app mobile modal popup to let user long-press safely
        setMobilePreviewUrl(dataUrl);
      } else {
        // Desktop standard automatic download link trigger
        const link = document.createElement('a');
        link.download = `collage_${slotCount}p.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
      alert('Error generating collage export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-[#0a0f1d] text-slate-100 rounded-3xl border border-cyan-500/30 shadow-2xl animate-fade-in font-sans relative">
      {/* Mobile Download Modal Overlay */}
      {mobilePreviewUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-cyan-500/40 p-4 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-base">Ready to Save!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Long-press the image below and select <b className="text-cyan-400">"Add to Photos"</b> or <b className="text-cyan-400">"Download Image"</b>.
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 max-h-[50vh] flex items-center justify-center p-2">
              <img src={mobilePreviewUrl} alt="Generated Collage" className="max-h-[45vh] object-contain rounded-xl shadow-lg" />
            </div>
            <button
              onClick={() => setMobilePreviewUrl(null)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs uppercase transition-all cursor-pointer border border-slate-700"
            >
              Close & Return to Studio
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for slot-specific uploads */}
      <input
        type="file"
        ref={activeUploadSlotRef}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z" />
              </svg>
            </span>
            Photo Collage Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click any slot on the preview or use the Photos tab to add pictures.
          </p>
        </div>

        <button
          onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 text-xs font-semibold transition-all shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Live Canvas Preview Panel */}
        <div className="lg:col-span-7 bg-[#070b14] p-6 rounded-2xl border border-slate-800/80 sticky top-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Collage Preview ({slotCount} Slots)
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              {aspectRatio}
            </span>
          </div>

          {/* Interactive Preview Box Frame */}
          <div
            className="w-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800 transition-all p-4 mx-auto"
            style={{
              backgroundColor: bgColor,
              aspectRatio: aspectRatio.replace(':', '/'),
              maxHeight: '500px',
            }}
          >
            <div
              className={`w-full h-full grid transition-all ${
                slotCount === 2
                  ? 'grid-cols-2 grid-rows-1'
                  : slotCount === 3
                  ? 'grid-cols-3 grid-rows-1'
                  : slotCount === 4
                  ? 'grid-cols-2 grid-rows-2'
                  : 'grid-cols-3 grid-rows-2'
              }`}
              style={{ gap: `${gap}px` }}
            >
              {Array.from({ length: slotCount }).map((_, idx) => {
                const img = slotImages[idx];
                return (
                  <div
                    key={idx}
                    className="w-full h-full overflow-hidden bg-slate-800/60 border border-slate-700/60 flex items-center justify-center relative group hover:border-cyan-400 transition-all"
                    style={{ borderRadius: `${borderRadius}px` }}
                  >
                    {img ? (
                      <>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label
                            htmlFor={`slot-file-${idx}`}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-bold cursor-pointer hover:bg-cyan-400"
                          >
                            Change
                          </label>
                          <button
                            onClick={() => removeSlotImage(idx)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-white text-[10px] font-bold cursor-pointer hover:bg-rose-400"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <label
                        htmlFor={`slot-file-${idx}`}
                        className="cursor-pointer text-center p-3 flex flex-col items-center justify-center w-full h-full hover:bg-cyan-500/10 transition-all"
                      >
                        <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg font-bold mb-1 border border-cyan-500/30">+</span>
                        <span className="text-cyan-400 text-xs font-semibold">Add Photo {idx + 1}</span>
                      </label>
                    )}

                    <input
                      type="file"
                      id={`slot-file-${idx}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSlotSpecificUpload(e, idx)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase mr-2">Ratio:</span>
            {['1:1', '4:5', '9:16', '16:9', '3:2'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === ratio
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right Sidebar Tabbed Controls */}
        <div className="lg:col-span-5 bg-[#0f172a]/90 p-5 rounded-2xl border border-slate-800/80 space-y-5">
          <div className="grid grid-cols-4 bg-[#070b14] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {[
              { id: 'layout', label: 'Layout' },
              { id: 'style', label: 'Style' },
              { id: 'photos', label: 'Photos' },
              { id: 'caption', label: 'Caption' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 rounded-lg transition-all cursor-pointer text-center truncate px-1 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: LAYOUT & SLOT SWITCHER */}
          {activeTab === 'layout' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Slot Count ({slotCount} Photos)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSlotCount(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        slotCount === num
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                          : 'bg-[#070b14] text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {num}P
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Templates ({slotCount}P)</span>
                <div className="grid grid-cols-1 gap-2">
                  {currentLayouts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedLayoutId(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedLayoutId === item.id
                          ? 'bg-cyan-500/15 border-cyan-500 text-white'
                          : 'bg-[#070b14] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">{slotCount} Slots</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STYLE & GAP */}
          {activeTab === 'style' && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Custom Spacing</span>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Gap Spacing: {gap}px</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Corner Radius: {borderRadius}px</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Frame Padding: {padding}px</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Background Theme</label>
                <div className="flex items-center gap-2">
                  {['#0a0f1d', '#ffffff', '#0f172a', '#000000', '#065f46', '#164e63'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setBgColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        bgColor === col ? 'border-cyan-400 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOS MANAGEMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Upload & Manage</span>
                <span className="text-cyan-400 font-mono text-xs">{Object.keys(slotImages).length} / {slotCount} filled</span>
              </div>

              <div className="border border-dashed border-cyan-500/40 rounded-xl p-4 text-center bg-[#070b14] hover:border-cyan-400 transition-all">
                <input
                  type="file"
                  id="general-upload-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="general-upload-input" className="cursor-pointer flex flex-col items-center">
                  <span className="text-xs font-bold text-white mb-1">+ Bulk Upload Photos</span>
                  <span className="text-[10px] text-slate-400">Images will auto-fill your slots</span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#070b14] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <img src={img.url} alt="" className="w-6 h-6 object-cover rounded-lg" />
                        <span className="text-slate-300 truncate max-w-[160px]">{img.name}</span>
                      </div>
                      <button onClick={() => removeImageFromPool(idx)} className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CAPTION */}
          {activeTab === 'caption' && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Collage Caption</span>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Caption Text</label>
                <input
                  type="text"
                  placeholder="e.g., Signature Collection"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070b14] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {['top', 'bottom'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setCaptionPosition(pos)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize cursor-pointer border ${
                        captionPosition === pos ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-[#070b14] border-slate-800 text-slate-400'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download Action Button */}
          <button
            onClick={handleDownloadCollage}
            disabled={isExporting || Object.keys(slotImages).length === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" md="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Generating High-Res...' : `Download ${slotCount}P High-Res Collage`}
          </button>
        </div>
      </div>
    </div>
  );
}