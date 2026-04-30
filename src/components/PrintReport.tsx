import QRCodeDisplay from './QRCodeDisplay';

interface PrintReportProps {
  certificates: any[];
}

export default function PrintReport({ certificates }: PrintReportProps) {
  return (
    <div className="print-only p-10 bg-white">
      <div className="text-center mb-10 border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Laporan Sertifikat Pegawai</h1>
        <p className="text-slate-500 font-medium">RSUD dr.H.Jusuf.SK Tarakan</p>
        <p className="text-xs text-slate-400 mt-2">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>

      <div className="space-y-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-t-2 border-b-2 border-slate-900">
              <th className="py-3 px-4 text-left text-xs font-bold uppercase">No.</th>
              <th className="py-3 px-4 text-left text-xs font-bold uppercase">Sertifikat</th>
              <th className="py-3 px-4 text-left text-xs font-bold uppercase">Pemilik</th>
              <th className="py-3 px-4 text-left text-xs font-bold uppercase">Masa Berlaku</th>
              <th className="py-3 px-4 text-center text-xs font-bold uppercase">QR Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {certificates.map((cert, index) => (
              <tr key={cert.id} className="break-inside-avoid">
                <td className="py-4 px-4 text-sm font-medium">{index + 1}</td>
                <td className="py-4 px-4">
                  <div className="font-bold text-sm text-slate-900">{cert.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">ID: {cert.id}</div>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-slate-800">{cert.owner}</td>
                <td className="py-4 px-4">
                  <div className="text-xs font-medium text-slate-700">{cert.expiryDate}</div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase">{cert.status}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="inline-block scale-75 origin-center">
                    <QRCodeDisplay cert={cert} size={80} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20 flex justify-between px-10">
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-16">Petugas Administrasi,</p>
          <div className="w-40 border-b border-slate-900 mx-auto"></div>
          <p className="text-xs font-bold mt-2">Nama Petugas</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-16">Mengetahui, Direktur</p>
          <div className="w-40 border-b border-slate-900 mx-auto"></div>
          <p className="text-xs font-bold mt-2">dr. Fransisca L.</p>
        </div>
      </div>
    </div>
  );
}
