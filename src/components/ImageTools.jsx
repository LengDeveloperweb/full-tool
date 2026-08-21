import { useState, useRef } from 'react';

export default function ImageTools({ onNavigate }) {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    const newImageObjs = validImages.map(file => ({
      id: Math.random().toString(36.25, 9),
      file,
      name: file.name,
      originalSize: file.size,
      originalUrl: URL.createObjectURL(file),
      compressedUrl: null,
      compressedSize: null,
      status: 'pending' // pending, processing, completed
    }));

    setImages(prev => [...prev, ...newImageObjs]);
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Compress and Convert Images
  const handleProcessAll = async () => {
    setIsProcessing(true);

    const updatedImages = await Promise.all(images.map(async (img) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(img.file);
        reader.onload = (event) => {
          const imageObj = new Image();
          imageObj.src = event.target.result;
          imageObj.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = imageObj.width;
            canvas.height = imageObj.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageObj, 0, 0);

            canvas.toBlob((blob) => {
              const compressedUrl = URL.createObjectURL(blob);
              resolve({
                ...img,
                compressedUrl,
                compressedSize: blob.size,
                status: 'completed'
              });
            }, targetFormat, quality / 100);
          };
        };
      });
    }));

    setImages(updatedImages);
    setIsProcessing(false);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeItem = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
        >
          <span>←</span> Back to Tools
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            Media Converter Suite
          </span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="p-8 rounded-[28px] bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Image Compressor & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Format Converter</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          Optimize, resize, and convert your PNG, JPEG, and WebP images securely directly in your browser with zero server uploads.
        </p>
      </div>

      {/* Upload Zone & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-2 border-2 border-dashed border-slate-700/80 hover:border-cyan-400/60 rounded-2xl p-8 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group min-h-[240px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl mb-4 group-hover:scale-110 transition-transform">
            📁
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 mb-1">
            Click to upload or drag & drop images here
          </h3>
          <p className="text-xs text-slate-400">
            Supports PNG, JPEG, WEBP, and BMP up to 50MB
          </p>
        </div>

        {/* Compression & Format Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Conversion Settings
            </h3>

            {/* Format Selection */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-slate-400">Convert to Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="image/webp">WebP (Recommended)</option>
                <option value="image/jpeg">JPEG / JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Quality Level</span>
                <span className="font-mono text-cyan-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleProcessAll}
            disabled={images.length === 0 || isProcessing}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
              images.length === 0 || isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20 active:scale-95 cursor-pointer'
            }`}
          >
            {isProcessing ? 'Processing Images...' : `Compress & Convert (${images.length})`}
          </button>
        </div>
      </div>

      {/* Image Queue List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Selected Files ({images.length})
            </h3>
            <button
              onClick={() => setImages([])}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {images.map((img) => {
              const savings = img.compressedSize 
                ? Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100) 
                : 0;

              return (
                <div 
                  key={img.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img 
                      src={img.originalUrl} 
                      alt={img.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate max-w-xs">{img.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>Original: <strong className="text-slate-300">{formatBytes(img.originalSize)}</strong></span>
                        {img.compressedSize && (
                          <>
                            <span>→</span>
                            <span>Compressed: <strong className="text-cyan-400">{formatBytes(img.compressedSize)}</strong></span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              -{savings}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {img.compressedUrl ? (
                      <a
                        href={img.compressedUrl}
                        download={`optimized-${img.name.substring(0, img.name.lastIndexOf('.')) || img.name}.${targetFormat.split('/')[1]}`}
                        className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>↓</span> Download
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                        Ready to convert
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(img.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all cursor-pointer"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}