import { Printer, Download, Bell, BellDot, Clock, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  title: string;
  onPrintClick: () => void;
  onExportClick?: () => void;
  showExport?: boolean;
  notifications?: any[];
  onMarkAsRead?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

export default function Header({ 
  title, 
  onPrintClick, 
  onExportClick, 
  showExport,
  notifications = [],
  onMarkAsRead,
  onClearAllNotifications
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.length;

  return (
    <div className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col pr-4 border-r border-slate-200">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Diklit</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none">Sistem Informasi</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative"
          >
            {unreadCount > 0 ? (
              <BellDot className="w-5 h-5 text-rose-500 animate-pulse" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-[140]" 
                  onClick={() => setShowNotifications(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[150] overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={onClearAllNotifications}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div 
                          key={note.id} 
                          className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 group relative"
                        >
                          <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-rose-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-tight">Masa berlaku segera habis</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{note.certName}</p>
                            <p className="text-[10px] text-rose-600 font-bold mt-1 uppercase tracking-tight">Kedaluwarsa: {note.expiryDate}</p>
                          </div>
                          <button 
                            onClick={() => onMarkAsRead?.(note.id)}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-300 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi baru</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {showExport && onExportClick && (
          <button 
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <div className="bg-emerald-100 p-1 rounded">
              <Download className="w-4 h-4 text-emerald-600" />
            </div>
            Ekspor Data
          </button>
        )}
        <button 
          onClick={onPrintClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-medium"
        >
          <div className="bg-blue-100 p-1 rounded">
            <Printer className="w-4 h-4 text-blue-600" />
          </div>
          Cetak Laporan
        </button>
      </div>
    </div>
  );
}
