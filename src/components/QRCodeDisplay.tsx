import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  cert: {
    name: string;
    owner: string;
    expiryDate: string;
    id: string;
  };
  size?: number;
}

export default function QRCodeDisplay({ cert, size = 128 }: QRCodeDisplayProps) {
  // Create a direct download link using the current origin
  const downloadLink = `${window.location.origin}?downloadCertId=${cert.id}`;
  
  return (
    <div className="bg-white p-2 rounded-xl border border-slate-100 inline-block shadow-sm">
      <QRCodeSVG 
        value={downloadLink} 
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}
