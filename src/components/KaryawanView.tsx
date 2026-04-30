import { useState, Fragment, useMemo } from 'react';
import { Search, Filter, MoreVertical, BadgeCheck, ShieldAlert, Trash2, Pencil, Download, FileText, ExternalLink, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

// ... existing employees constant (moving it inside or removing if using prop)

interface KaryawanViewProps {
  data?: any[];
  setData?: (data: any[]) => void;
  onEdit?: (emp: any) => void;
  onDelete?: (emp: any) => void;
  onSelectEmployee?: (emp: any) => void;
  certificatesData?: any[];
  onDownload?: (cert: any) => void;
  onDownloadPDF?: (cert: any) => void;
}

export default function KaryawanView({ data, setData, onEdit, onDelete, onSelectEmployee, certificatesData = [], onDownload, onDownloadPDF }: KaryawanViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'dept' | 'status' | 'id' | 'certs'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (field: 'name' | 'dept' | 'status' | 'id' | 'certs') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const displayData = useMemo(() => {
    // 1. Get all unique normalized names from both employees (data) and certificates
    const allOwners = new Set([
      ...(data || []).map(e => (e.name || '').trim().toLowerCase()),
      ...certificatesData.map(c => (c.owner || '').trim().toLowerCase())
    ]);

    // 2. Map normalized names back to display objects
    const baseData = Array.from(allOwners).filter(Boolean).map(lowerName => {
      const existingEmp = (data || []).find(e => (e.name || '').trim().toLowerCase() === lowerName);
      const empCerts = certificatesData.filter(c => (c.owner || '').trim().toLowerCase() === lowerName);
      
      const displayName = existingEmp?.name || (empCerts.length > 0 ? empCerts[0].owner : lowerName);
      const certificates = empCerts || [];
      const nip = existingEmp?.nip || certificates.find(c => c.nip)?.nip || '';
      const generatedId = nip ? nip : `ID-${displayName.toUpperCase().replace(/\s+/g, '')}`;
      
      // Integrate Jabatan: If existingEmp has role use it, else try to get Jabatan from certificates
      const jabatanFromCert = certificates.find(c => c.fileUrl)?.fileUrl;
      const displayRole = existingEmp?.role && existingEmp.role !== 'Staf (Otomatis)' 
        ? existingEmp.role 
        : (jabatanFromCert || 'Staf (Otomatis)');

      return {
        id: existingEmp?.id || generatedId,
        name: displayName,
        nip: nip,
        role: displayRole,
        dept: existingEmp?.dept || 'Umum',
        status: (empCerts && empCerts.length > 0) ? 'Lengkap' : 'Belum Lengkap',
        certificates: certificates,
        image: existingEmp?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
      };
    });
    // 3. Filter based on search term and sort
    const filtered = baseData.filter(emp => 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.dept || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') comparison = (a.name || '').localeCompare(b.name || '');
      else if (sortField === 'id') comparison = (a.id || '').localeCompare(b.id || '');
      else if (sortField === 'dept') comparison = (a.dept || '').localeCompare(b.dept || '');
      else if (sortField === 'status') comparison = (a.status || '').localeCompare(b.status || '');
      else if (sortField === 'certs') comparison = (a.certificates?.length || 0) - (b.certificates?.length || 0);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [certificatesData, data, searchTerm, sortField, sortOrder]);

  const handleDelete = (emp: any) => {
    onDelete?.(emp);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari karyawan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th 
                  className="pb-4 pt-0 font-bold text-xs uppercase tracking-wider text-slate-400 font-sans cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Karyawan
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="pb-4 pt-0 font-bold text-xs uppercase tracking-wider text-slate-400 font-sans cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('dept')}
                >
                  <div className="flex items-center gap-2">
                    Jabatan / Dep
                    {sortField === 'dept' ? (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="pb-4 pt-0 font-bold text-xs uppercase tracking-wider text-slate-400 font-sans cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' ? (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </div>
                </th>
                <th 
                  className="pb-4 pt-0 font-bold text-xs uppercase tracking-wider text-slate-400 font-sans cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleSort('certs')}
                >
                  <div className="flex items-center gap-2">
                    Daftar Sertifikat
                    {sortField === 'certs' ? (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </div>
                </th>
                <th className="pb-4 pt-0 font-bold text-xs uppercase tracking-wider text-slate-400 font-sans text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData.map((emp) => (
                <Fragment key={emp.id}>
                  <tr 
                    onClick={() => {
                      setExpandedId(expandedId === emp.id ? null : emp.id);
                      onSelectEmployee?.(emp);
                    }}
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.image} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{emp.name}</div>
                          <div className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                            {emp.nip ? emp.nip : 'Belum Ada NIP'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-700">{emp.role}</div>
                      <div className="text-xs text-slate-400">{emp.dept}</div>
                    </td>
                    <td className="py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide",
                        emp.certificates.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {emp.certificates.length > 0 ? <BadgeCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {emp.certificates.length > 0 ? 'Lengkap' : 'Tanpa Sertifikat'}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                          {emp.certificates.length} Sertifikat
                        </div>
                        {emp.certificates.length > 0 && (
                          <div className="flex -space-x-2">
                            {emp.certificates.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center">
                                <BadgeCheck className="w-3 h-3 text-blue-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit?.(emp); }}
                          className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors border border-slate-100"
                          title="Edit Data"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(emp); }}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-slate-100"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === emp.id && emp.certificates.length > 0 && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {emp.certificates.map((cert: any) => (
                            <div key={cert.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{cert.id}</div>
                              <div className="text-sm font-bold text-slate-800">{cert.name}</div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-medium text-slate-500">Kedaluwarsa: {cert.expiryDate}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{cert.skp} SKP</span>
                                  {( (cert.fileUrl && cert.fileUrl.startsWith('http')) || cert.fileName) && (
                                    <a 
                                      href={cert.fileUrl && cert.fileUrl.startsWith('http') ? cert.fileUrl : '#'} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                      title={cert.fileUrl && cert.fileUrl.startsWith('http') ? "Buka di Google Drive" : `File: ${cert.fileName || 'Tersimpan'}`}
                                      onClick={(e) => {
                                        if (!cert.fileUrl || !cert.fileUrl.startsWith('http')) {
                                          e.preventDefault();
                                          if (cert.fileName) {
                                            alert(`File ${cert.fileName} telah diunggah.`);
                                          }
                                        }
                                      }}
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onDownload?.(cert); }}
                                    className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                    title="Unduh Sertifikat"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onDownloadPDF?.(cert); }}
                                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="Unduh PDF"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
