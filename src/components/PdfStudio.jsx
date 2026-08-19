import { useState } from 'react';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const DEFAULT_MARKDOWN = `Use vector assets for high DPI printing.
- Clean typography hierarchy
- Responsive scaling layout
- Optimized client-side generation`;

export default function PdfStudio({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('doc');

  const [docTitle, setDocTitle] = useState('Project Specification & Roadmap');
  const [docSubtitle, setDocSubtitle] = useState('Engineering Team Notes');
  const [author, setAuthor] = useState('Engineering Team');
  const [paperSize, setPaperSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);

  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultDate = new Date().toLocaleDateString();

  const handleDownloadDocPdf = () => {
    setIsProcessing(true);
    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: paperSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(docTitle, contentWidth - 45);
      doc.text(titleLines, margin, y);

      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${defaultDate}`, pageWidth - margin, y - 2, { align: 'right' });
      doc.text(`By: ${author}`, pageWidth - margin, y + 3, { align: 'right' });

      y += titleLines.length * 8;

      if (docSubtitle) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(16, 185, 129);
        doc.text(docSubtitle, margin, y);
        y += 8;
      }

      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      const lines = markdownText.split('\n');

      lines.forEach((line) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(15, 23, 42);
          const text = trimmed.replace('# ', '');
          const wrapped = doc.splitTextToSize(text, contentWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 7;
        } else if (trimmed.startsWith('## ')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(16, 185, 129);
          const text = trimmed.replace('## ', '');
          const wrapped = doc.splitTextToSize(text, contentWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 6;
        } else if (trimmed.startsWith('- ')) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          const clean = trimmed.replace('- ', '').replace(/\*\*/g, '');
          const wrapped = doc.splitTextToSize(`• ${clean}`, contentWidth - 5);
          doc.text(wrapped, margin + 3, y);
          y += wrapped.length * 5;
        } else if (trimmed === '') {
          y += 3;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          const clean = trimmed.replace(/\*\*/g, '');
          const wrapped = doc.splitTextToSize(clean, contentWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 5;
        }
      });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Generated via PDF Studio', margin, pageHeight - 10);
      doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 10, { align: 'right' });

      // Safe export logic for mobile & desktop
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        window.open(blobUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`;
        link.click();
      }
    } catch (err) {
      console.error(err);
      alert('Error generating document PDF. Make sure jspdf is installed properly.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (imageFiles.length === 0) return alert('Select image files first.');
    setIsProcessing(true);
    try {
      const doc = new jsPDF();
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const dataUrl = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        });

        if (i > 0) doc.addPage();
        const formatMatch = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,/i);
        const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
        const imgProps = doc.getImageProperties(dataUrl);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(dataUrl, format, 0, 0, pdfWidth, pdfHeight);
      }
      
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'image_bundle.pdf';
      link.click();
    } catch (e) {
      console.error(e);
      alert('Error converting images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMergePdfs = async () => {
    if (pdfFiles.length < 2) return alert('Select at least 2 PDF files.');
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of pdfFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged_document.pdf';
      link.click();
    } catch (e) {
      console.error(e);
      alert('Error merging PDFs. Make sure pdf-lib is installed properly.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-[#0a0f1d] text-slate-100 rounded-3xl border border-slate-800/80 shadow-2xl animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            PDF Converter & Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Convert formatted text/markdown to PDF, compile image galleries into documents, or merge multiple PDFs client-side.
          </p>
        </div>

        <button
          onClick={() => (onNavigate ? onNavigate('home') : (window.location.hash = 'home'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold transition-all shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 mb-8 bg-[#070b14] rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('doc')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'doc'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Document & Notes to PDF
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'images'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Images to PDF Bundle
        </button>

        <button
          onClick={() => setActiveTab('merge')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'merge'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Merge PDF Files
        </button>
      </div>

      {activeTab === 'doc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 bg-[#0f172a]/80 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Document Title</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Subtitle / Category</label>
                  <input
                    type="text"
                    value={docSubtitle}
                    onChange={(e) => setDocSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Author / Org</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Paper Size</label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="a4">A4 Standard</option>
                    <option value="letter">US Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#0f172a]/80 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Document Content (Markdown / Text)
                </label>
              </div>
              <textarea
                rows="10"
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#070b14] border border-slate-700/80 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <button
              onClick={handleDownloadDocPdf}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Generating PDF...' : 'Download Formatted PDF'}
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#070b14] p-6 rounded-2xl border border-slate-800/80 sticky top-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                Live Preview Output Data
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-[480px] overflow-y-auto">
              <p className="text-emerald-400 font-bold mb-2"># {docTitle}</p>
              <p className="text-slate-400 mb-4">{docSubtitle} • By {author}</p>
              <hr className="border-slate-800 mb-4" />
              {markdownText}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
          <div className="border border-dashed border-slate-700/80 rounded-2xl p-12 text-center bg-[#070b14]/60 transition-all">
            <input
              type="file"
              id="img-bundle-input"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="hidden"
            />
            <label htmlFor="img-bundle-input" className="cursor-pointer flex flex-col items-center">
              <span className="text-base font-bold text-white tracking-wide">Select or Drag Images to Convert</span>
              <span className="text-xs text-slate-400 mt-1.5">{imageFiles.length} file(s) selected</span>
            </label>
          </div>

          <button
            onClick={handleImagesToPdf}
            disabled={isProcessing || imageFiles.length === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {isProcessing ? 'Converting...' : 'Compile Images into PDF'}
          </button>
        </div>
      )}

      {activeTab === 'merge' && (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-400 rounded-2xl p-10 text-center bg-[#0f172a]/50 transition-all">
            <input
              type="file"
              id="pdf-merge-input"
              multiple
              accept=".pdf"
              onChange={(e) => setPdfFiles(Array.from(e.target.files))}
              className="hidden"
            />
            <label htmlFor="pdf-merge-input" className="cursor-pointer flex flex-col items-center">
              <span className="text-sm font-bold text-white">Click or drag PDF files to merge</span>
              <span className="text-xs text-slate-400 mt-1">{pdfFiles.length} file(s) selected</span>
            </label>
          </div>

          <button
            onClick={handleMergePdfs}
            disabled={isProcessing || pdfFiles.length < 2}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? 'Merging PDFs...' : 'Merge Selected PDF Files'}
          </button>
        </div>
      )}
    </div>
  );
}