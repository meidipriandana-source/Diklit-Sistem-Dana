import { useState, Fragment, useEffect, useRef } from 'react';
import { Award, Download, ExternalLink, Search, Pencil, Trash2, AlertTriangle, X, FileText, Eye, QrCode, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import QRCodeDisplay from './QRCodeDisplay';
import { GoogleGenAI } from "@google/genai";

function IndeterminateCheckbox({ 
  checked, 
  indeterminate, 
  onChange, 
  className 
}: { 
  checked: boolean; 
  indeterminate: boolean; 
  onChange: () => void; 
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all",
        className
      )}
      checked={checked}
      onChange={(e) => {
        e.stopPropagation();
        onChange();
      }}
    />
  );
}

interface SertifikatViewProps {
  themeColor?: string;
  data?: any[];
  employees?: any[];
  onEdit?: (cert: any) => void;
  onDelete?: (id: string | string[]) => void;
  onAdd?: () => void;
  onDeleteEmployee?: (emp: any) => void;
  onDownload?: (cert: any) => void;
  onDownloadPDF?: (cert: any) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function SertifikatView({ 
  themeColor = 'bg-blue-600', 
  data = [], 
  employees = [],
  onEdit, 
  onDelete,
  onAdd,
  onDeleteEmployee,
  onDownload,
  onDownloadPDF
}: SertifikatViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCert, setViewingCert] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedOwners, setExpandedOwners] = useState<string[]>([]);

  // AI Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  useEffect(() => {
    if (!viewingCert) {
      setSummary(null);
      setIsSummaryExpanded(false);
    }
  }, [viewingCert]);

  const generateSummary = async () => {
    if (!viewingCert || isGeneratingSummary) return;

    setIsGeneratingSummary(true);
    try {
      const prompt = `Berikan ringkasan profesional singkat (maksimal 3 kalimat) dalam Bahasa Indonesia untuk sertifikat berikut:
      Nama Sertifikat: ${viewingCert.name}
      Pemilik: ${viewingCert.owner}
      SKP: ${viewingCert.skp}
      Status: ${viewingCert.status}
      Focus pada nilai kompetensi yang didapat dari sertifikat ini bagi seorang profesional kesehatan di RSUD.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setSummary(response.text || "Tidak dapat menghasilkan ringkasan.");
      setIsSummaryExpanded(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Gagal menghasilkan ringkasan. Silakan coba lagi.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const filteredData = (data || []).filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.id && cert.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group data by owner (case-insensitive grouping)
  const groupedData = filteredData.reduce((acc: any, cert) => {
    // Normalize key to handle different casing (e.g., "Dana" and "DANA")
    const ownerKey = cert.owner.trim().toLowerCase();
    
    if (!acc[ownerKey]) {
      acc[ownerKey] = {
        owner: cert.owner.trim(), // Use trimmed name for display
        certificates: [],
        totalSkp: 0,
        latestExpiry: '',
        status: 'Aktif'
      };
    }
    acc[ownerKey].certificates.push(cert);
    acc[ownerKey].totalSkp += cert.skp || 0;
    
    // Simple logic to determine if any certificate is not active
    if (cert.status !== 'Aktif') acc[ownerKey].status = cert.status;
    
    return acc;
  }, {});

  const displayGroups = Object.values(groupedData);

  const toggleOwnerExpand = (owner: string) => {
    const ownerKey = owner.toLowerCase();
    setExpandedOwners(prev => 
      prev.includes(ownerKey) ? prev.filter(o => o !== ownerKey) : [...prev, ownerKey]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(c => c.id).filter(Boolean));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleGroup = (group: any) => {
    const certIds = group.certificates.map((c: any) => c.id).filter(Boolean);
    const selectedInGroup = certIds.filter((id: string) => selectedIds.includes(id));
    const allSelectedInGroup = selectedInGroup.length === certIds.length;

    if (allSelectedInGroup) {
      // Deselect all in this group
      setSelectedIds(prev => prev.filter(id => !certIds.includes(id)));
    } else {
      // Select all in this group
      setSelectedIds(prev => {
        const newSelection = [...prev];
        certIds.forEach((id: string) => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const getGroupState = (group: any) => {
    const certIds = group.certificates.map((c: any) => c.id).filter(Boolean);
    const selectedInGroupCount = certIds.filter((id: string) => selectedIds.includes(id)).length;
    
    return {
      checked: selectedInGroupCount === certIds.length && certIds.length > 0,
      indeterminate: selectedInGroupCount > 0 && selectedInGroupCount < certIds.length
    };
  };

  const isHeaderIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredData.length;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {viewingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Detail Sertifikat</h3>
                      <p className="text-sm text-slate-400 font-medium">{viewingCert.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingCert(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Nama Sertifikat</label>
                      <div className="text-base font-bold text-slate-800">{viewingCert.name}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Pemilik</label>
                      <div className="text-base font-bold text-slate-700">{viewingCert.owner}</div>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">SKP</label>
                        <div className="text-base font-bold text-blue-600">{viewingCert.skp} SKP</div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Jabatan</label>
                        <div className="text-sm font-bold text-slate-700">{viewingCert.fileUrl || '-'}</div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Status</label>
                        <div className={cn(
                           "text-sm font-bold",
                           viewingCert.status === 'Aktif' ? 'text-emerald-500' : 'text-amber-500'
                        )}>{viewingCert.status}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Masa Berlaku</label>
                      <div className="text-sm font-medium text-slate-700">{viewingCert.issueDate} - {viewingCert.expiryDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <QRCodeDisplay cert={viewingCert} size={160} />
                    <div className="mt-4 flex items-center gap-2 text-slate-400">
                      <QrCode className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Verifikasi Digital QR</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary Section */}
                <div className="mb-8 border border-blue-100 rounded-2xl overflow-hidden bg-white">
                  {!summary && !isGeneratingSummary ? (
                    <button 
                      onClick={generateSummary}
                      className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Sparkles className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-sm font-bold">Generate Summary with AI</span>
                      </div>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                  ) : (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                        className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 border-b border-blue-100"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-bold">Ringkasan Sertifikat (AI)</span>
                        </div>
                        {isSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {isSummaryExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-blue-50/30 overflow-hidden"
                          >
                            <div className="p-4 leading-relaxed text-sm text-slate-600 font-medium">
                              {isGeneratingSummary ? (
                                <div className="flex items-center gap-3 py-2 text-blue-500 animate-pulse">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Menganalisis sertifikat...</span>
                                </div>
                              ) : (
                                summary
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      onDownloadPDF?.(viewingCert);
                      setViewingCert(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Unduh Sertifikat PDF
                  </button>
                  <button 
                    onClick={() => setViewingCert(null)}
                    className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10"
          >
            <div className="flex items-center gap-3 pr-8 border-r border-white/20">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                {selectedIds.length}
              </div>
              <span className="text-sm font-bold tracking-tight">Dipilih</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const selectedCerts = filteredData.filter(c => selectedIds.includes(c.id));
                  selectedCerts.forEach(cert => onDownloadPDF?.(cert));
                  setSelectedIds([]);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                Unduh PDF ({selectedIds.length})
              </button>
              <button 
                onClick={() => {
                  onDelete?.(selectedIds);
                  setSelectedIds([]);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors text-sm font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama sertifikat atau pemilik..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden italic text-[8px] font-bold text-slate-400">
                  IMG
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                +{displayGroups.length}
              </div>
            </div>
            <button 
              onClick={onAdd}
              className={cn("px-4 py-2 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:brightness-90", themeColor)}
            >
              Tambah Sertifikat
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-4 pl-4 w-10">
                  <IndeterminateCheckbox 
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                    indeterminate={isHeaderIndeterminate}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider font-sans">Pemilik / Pegawai</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider font-sans">Jumlah</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider font-sans text-center">Total SKP</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider font-sans text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayGroups.map((group: any) => {
                const ownerKey = group.owner.toLowerCase();
                const isExpanded = expandedOwners.includes(ownerKey);
                
                return (
                  <Fragment key={ownerKey}>
                    <tr 
                      className={cn(
                        "group hover:bg-slate-50/50 transition-colors cursor-pointer",
                        isExpanded && "bg-slate-50/80"
                      )}
                      onClick={() => toggleOwnerExpand(group.owner)}
                    >
                    <td className="py-5 pl-4" onClick={(e) => e.stopPropagation()}>
                      <IndeterminateCheckbox 
                        {...getGroupState(group)}
                        onChange={() => handleToggleGroup(group)}
                      />
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                          {group.owner.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{group.owner}</div>
                          <div className="text-xs text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block mt-1">
                            {(() => {
                              const emp = employees.find(e => (e.name || '').trim().toLowerCase() === ownerKey);
                              const certNip = group.certificates.find((c: any) => c.nip)?.nip;
                              const nip = emp?.nip || certNip;
                              const role = emp?.role || group.certificates.find((c: any) => c.fileUrl)?.fileUrl || 'Staf';
                              return `${nip || 'Pegawai RSUD'} • ${role}`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                        <FileText className="w-3.5 h-3.5" />
                        {group.certificates.length} Sertifikat
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <span className="font-bold text-slate-700">{group.totalSkp}</span>
                      <span className="ml-1 text-[10px] font-bold text-slate-400">SKP</span>
                    </td>
                    <td className="py-5 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const emp = employees.find(e => (e.name || '').trim().toLowerCase() === ownerKey);
                            const name = group.owner;
                            const nip = emp?.nip || group.certificates.find((c: any) => c.nip)?.nip;
                            onDeleteEmployee?.({ id: emp?.id, name, nip });
                          }}
                          className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          title="Hapus Pegawai"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isExpanded ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {isExpanded ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                    {/* Expanded Rows */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50/30"
                        >
                          <td colSpan={5} className="p-0">
                            <div className="px-16 py-4 space-y-2">
                              {group.certificates.map((cert: any) => (
                              <div key={cert.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 group">
                                <div className="flex items-center gap-4">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={selectedIds.includes(cert.id)}
                                    onChange={() => toggleSelect(cert.id)}
                                  />
                                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Award className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-800">{cert.name}</div>
                                    <div className="text-[10px] font-medium text-slate-400 flex items-center gap-2">
                                      <span>ID: {cert.id}</span>
                                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                      <span>Exp: {cert.expiryDate}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                                    {cert.status}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => setViewingCert(cert)}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"
                                    >
                                      <QrCode className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => onEdit?.(cert)}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-600"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => onDelete?.(cert.id)}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    {( (cert.fileUrl && cert.fileUrl.startsWith('http')) || cert.fileName) && (
                                       <a 
                                        href={cert.fileUrl && cert.fileUrl.startsWith('http') ? cert.fileUrl : '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                                        onClick={(e) => {
                                          if (!cert.fileUrl || !cert.fileUrl.startsWith('http')) {
                                            e.preventDefault();
                                            if (cert.fileName) {
                                              alert(`File ${cert.fileName} tersedia di sistem (Simulasi)`);
                                            }
                                          }
                                        }}
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
