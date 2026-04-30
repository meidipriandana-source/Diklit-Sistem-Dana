import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Save, Upload, FileUp, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface EditCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  cert: any;
  onSave: (updatedData: any) => void;
  themeColor: string;
}

export default function EditCertModal({ isOpen, onClose, cert, onSave, themeColor }: EditCertModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    nip: '',
    skp: 0,
    fileUrl: '',
    status: 'Aktif',
    fileName: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cert) {
      setFormData({
        name: cert.name || '',
        owner: cert.owner || '',
        nip: cert.nip || '',
        skp: cert.skp || 0,
        fileUrl: cert.fileUrl || '',
        status: cert.status || 'Aktif',
        fileName: cert.fileName || ''
      });
      setSelectedFile(null);
    }
  }, [cert]);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, fileName: file.name }));
    } else if (file) {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      // In a real app, you'd upload the file here and get a URL
      // For now, we just pass the fileName
      file: selectedFile 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Edit Sertifikat</h3>
                    <p className="text-sm text-slate-400 font-medium">Perbarui informasi sertifikat pegawai</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nama Sertifikat</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="Contoh: ISO 9001 Mastery"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="Nama lengkap pegawai"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">NIP / NRPTT</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="Contoh: 19800101..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">SKP</label>
                    <input
                      type="number"
                      required
                      value={formData.skp}
                      onChange={(e) => setFormData({ ...formData, skp: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Segera Habis">Segera Habis</option>
                      <option value="Akan Kedaluwarsa">Akan Kedaluwarsa</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Jabatan</label>
                    <input
                      type="text"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="Masukkan jabatan pegawai"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">ATAU UNGGAH FILE</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50/10 transition-all cursor-pointer bg-slate-50/30 group",
                      (selectedFile || formData.fileName) ? "border-blue-400 bg-blue-50/20" : "border-slate-200"
                    )}
                  >
                    <div className="flex flex-col items-center text-center">
                      {(selectedFile || formData.fileName) ? (
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-white rounded-lg shadow-sm mb-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 truncate max-w-xs">{selectedFile?.name || formData.fileName}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'File tersimpan'}
                          </p>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setFormData(prev => ({ ...prev, fileName: '' }));
                            }}
                            className="mt-3 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Hapus File
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                            <FileUp className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">Klik untuk unggah sertifikat PDF</p>
                          <p className="text-xs text-slate-400 mt-1">Maksimum file 5MB</p>
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

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      "flex-1 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2",
                      themeColor
                    )}
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
