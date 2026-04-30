import React, { useState, useRef } from 'react';
import { Upload, User, IdCard, FileBadge, Hash, FileUp, CheckCircle2, Award, Trash2, Pencil, FileText, X, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import QRScanner from './QRScanner';

interface DashboardViewProps {
  themeColor?: string;
  onAddCertificate?: (data: any) => void;
  onDeleteCertificate?: (id: string) => void;
  onEditCertificate?: (cert: any) => void;
  recentCertificates?: any[];
}

export default function DashboardView({ 
  themeColor = 'bg-blue-600', 
  onAddCertificate, 
  onDeleteCertificate,
  onEditCertificate,
  recentCertificates = [] 
}: DashboardViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    certName: '',
    certNo: '',
    skp: '',
    fileUrl: '',
    file: null as File | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setFormData(prev => ({
        ...prev,
        name: parsed.owner || prev.name,
        certName: parsed.name || prev.certName,
        certNo: parsed.id || prev.certNo,
        skp: parsed.skp?.toString() || prev.skp
      }));
    } catch (e) {
      // If not JSON, just put the raw text in certNo as a fallback
      setFormData(prev => ({ ...prev, certNo: data }));
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file }));
    } else if (file) {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate a submission
    setTimeout(() => {
      onAddCertificate?.({
        name: formData.certName,
        owner: formData.name,
        nip: formData.nip,
        id: formData.certNo,
        skp: parseInt(formData.skp),
        fileUrl: formData.fileUrl,
        fileName: formData.file?.name
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', nip: '', certName: '', certNo: '', skp: '', fileUrl: '', file: null });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Input Data Pelatihan Pegawai</h2>
            <p className="text-sm text-slate-500 mt-1">Lengkapi formulir di bawah ini untuk menambahkan data sertifikat baru ke sistem.</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            Scan QR Sertifikat
          </button>
        </div>

        <QRScanner 
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          onScan={handleScan} 
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Nama Pegawai
              </label>
              <input 
                required
                type="text" 
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-blue-500" />
                NIP / NRPTT
              </label>
              <input 
                required
                type="text" 
                placeholder="Masukkan NIP atau NRPTT"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-blue-500" />
                Judul Sertifikat
              </label>
              <input 
                required
                type="text" 
                placeholder="Contoh: HSE Level 3 certified"
                value={formData.certName}
                onChange={(e) => setFormData({ ...formData, certName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                Nomor Sertifikat
              </label>
              <input 
                required
                type="text" 
                placeholder="Masukkan nomor sertifikat resmi"
                value={formData.certNo}
                onChange={(e) => setFormData({ ...formData, certNo: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                Jumlah SKP
              </label>
              <input 
                required
                type="number" 
                placeholder="Contoh: 25"
                value={formData.skp}
                onChange={(e) => setFormData({ ...formData, skp: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-blue-500" />
                Jabatan
              </label>
              <input 
                type="text" 
                placeholder="Masukkan jabatan pegawai"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-blue-500" />
              Unggah File Sertifikat (PDF)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer bg-slate-50/50 group relative",
                formData.file ? "border-blue-400 bg-blue-50/20" : "border-slate-200"
              )}
            >
              <div className="flex flex-col items-center text-center">
                {formData.file ? (
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">{formData.file.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{(formData.file.size / 1024).toFixed(1)} KB</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, file: null }));
                      }}
                      className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Ganti File
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Pilih file atau tarik ulur di sini</p>
                    <p className="text-xs text-slate-400 mt-1">Format: PDF (Maks. 5MB)</p>
                  </>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-8 py-3 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                themeColor,
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:brightness-90 active:scale-95"
              )}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Simpan Data Sertifikat'}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold">Data sertifikat berhasil disimpan ke database!</span>
        </motion.div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Pembaruan Terkini</h3>
        <div className="space-y-3">
          {recentCertificates.length > 0 ? recentCertificates.slice(0, 5).map((item, i) => {
            const getRelativeTime = (timestamp: number | undefined) => {
              if (!timestamp) return 'Baru saja';
              const seconds = Math.floor((Date.now() - timestamp) / 1000);
              if (seconds < 60) return 'Baru saja';
              if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
              if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
              return `${Math.floor(seconds / 86400)} hari yang lalu`;
            };

            return (
              <div key={item.id || i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.owner || item.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{item.name} • <span className="font-bold text-blue-600">{item.skp} SKP</span></div>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter ml-auto">
                  {getRelativeTime(item.updatedAt)}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCertificate?.(item);
                    }}
                    className="p-2 bg-white hover:bg-amber-50 text-slate-300 hover:text-amber-500 rounded-lg transition-all border border-slate-100 shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCertificate?.(item.id);
                    }}
                    className="p-2 bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-all border border-slate-100 shadow-sm"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
               <p className="text-sm text-slate-400 font-medium">Belum ada pembaruan data sertifikat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
