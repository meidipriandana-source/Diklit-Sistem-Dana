import React from 'react';
import { Download, RefreshCw, Palette, Shield, Bell, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import AnimatedLogo from './AnimatedLogo';

interface SettingsViewProps {
  themeColor: string;
  onThemeChange: (color: string) => void;
  onExport: () => void;
  onRestore: (file: File) => void;
  onBgImageChange: (image: string | null) => void;
  currentBgImage: string | null;
  onClearAll?: () => void;
}

const colors = [
  { name: 'Biru', value: 'bg-blue-600' },
  { name: 'Zamrud', value: 'bg-emerald-600' },
  { name: 'Indigo', value: 'bg-indigo-600' },
  { name: 'Mawar', value: 'bg-rose-600' },
  { name: 'Amber', value: 'bg-amber-600' },
  { name: 'Slate', value: 'bg-slate-800' },
];

export default function SettingsView({ themeColor, onThemeChange, onExport, onRestore, onBgImageChange, currentBgImage, onClearAll }: SettingsViewProps) {
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [daysBefore, setDaysBefore] = React.useState(30);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bgInputRef = React.useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRestore(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onBgImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Branding Section */}
      <div className={cn("p-8 rounded-2xl shadow-lg border border-white/20 text-white overflow-hidden relative", themeColor)}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="scale-150">
            <AnimatedLogo />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">Danova System</h2>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-md">
              Sistem Manajemen Sertifikat RSUD dr. H. Jusuf SK.
              Personalisasi logo dan identitas visual aplikasi Anda melalui menu pengaturan ini.
            </p>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <Shield className="w-64 h-64" />
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Manajemen Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={onExport}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all text-left group"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Ekspor Data</div>
              <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Unduh semua data ke format CSV</div>
            </div>
          </button>
          
          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
            <button 
              onClick={handleRestoreClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all text-left group"
            >
              <div className="p-3 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Pulihkan Data</div>
                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">Pulihkan data dari file cadangan</div>
              </div>
            </button>
          </div>

          <button 
            onClick={onClearAll}
            className="flex items-center gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 transition-all text-left group md:col-span-2"
          >
            <div className="p-3 bg-rose-200 rounded-lg group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="font-bold text-rose-800 text-sm">Bersihkan Semua Data</div>
              <div className="text-xs text-rose-500 font-medium">Hapus semua data sertifikat dan karyawan secara permanen</div>
            </div>
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-500" />
          Tampilan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block text-slate-400 uppercase tracking-widest text-[10px]">Warna Tema Sidebar</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onThemeChange(color.value)}
                  className={cn(
                    "w-10 h-10 rounded-lg transition-all relative flex items-center justify-center",
                    color.value,
                    themeColor === color.value ? "ring-2 ring-offset-2 ring-slate-300 scale-110 shadow-lg" : "hover:scale-105 opacity-80 hover:opacity-100"
                  )}
                >
                  {themeColor === color.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block text-slate-400 uppercase tracking-widest text-[10px]">Gambar Latar Sidebar</label>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={bgInputRef} 
                onChange={handleBgUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => bgInputRef.current?.click()}
                className="flex-1 px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 h-14 bg-slate-50"
              >
                <Palette className="w-4 h-4" />
                Unggah Gambar
              </button>
              
              {currentBgImage && (
                <button 
                  onClick={() => onBgImageChange(null)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all h-14"
                >
                  Hapus
                </button>
              )}
            </div>
            {currentBgImage && (
              <div className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={currentBgImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notifikasi
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-700">Email Kedaluwarsa</div>
                <div className="text-xs text-slate-500 font-medium">Kirim peringatan otomatis via email</div>
              </div>
              <button 
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors duration-200",
                  emailEnabled ? themeColor : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200",
                  emailEnabled ? "right-1" : "right-6"
                )} />
              </button>
            </div>

            {emailEnabled && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Peringatan Hari Sebelum Kedaluwarsa
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={daysBefore}
                    onChange={(e) => setDaysBefore(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    min="1"
                    max="365"
                  />
                  <span className="text-sm font-bold text-slate-500">Hari</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Sistem akan mengirim email pengingat kepada pegawai dan admin {daysBefore} hari sebelum sertifikat habis masa berlakunya.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            Keamanan
          </h3>
          <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
            Ubah Kata Sandi
          </button>
        </div>
      </div>
    </div>
  );
}
