import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Clock } from 'lucide-react';

interface NotificationToastProps {
  notifications: any[];
  onClose: (id: string) => void;
}

export default function NotificationToast({ notifications, onClose }: NotificationToastProps) {
  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(0, 3).map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-4 w-80 pointer-events-auto flex gap-4 overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 truncate">Sertifikat Kedaluwarsa</h4>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-1">{note.certName}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                H-7 Kedaluwarsa
              </div>
            </div>
            <button 
              onClick={() => onClose(note.id)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
