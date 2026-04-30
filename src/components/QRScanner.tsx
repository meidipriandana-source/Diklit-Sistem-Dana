import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure the container is rendered
      const timer = setTimeout(() => {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );
        scannerRef.current.render(onScanSuccess, onScanFailure);
      }, 300);

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => console.error("Failed to clear scanner:", error));
        }
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const onScanSuccess = (decodedText: string) => {
    onScan(decodedText);
    onClose();
  };

  const onScanFailure = (error: any) => {
    // Silently ignore scan failures (they happen constantly when no QR is in view)
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-800 font-bold">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <span>Scanner QR Sertifikat</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div id="qr-reader" className="overflow-hidden rounded-2xl border-2 border-slate-100"></div>
              <p className="mt-4 text-center text-xs text-slate-400 font-medium">
                Posisikan kode QR di dalam kotak untuk memindai otomatis
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
