// src/utils/download.js
export function downloadFile(blob, filename) {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = URL.createObjectURL(blob);

  if (isIOS) {
    const opened = window.open(url, '_blank');
    if (!opened) {
      window.location.href = url;
    }
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  }
}