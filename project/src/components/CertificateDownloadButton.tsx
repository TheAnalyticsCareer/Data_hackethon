import React from 'react';
import { downloadCertificateAsPDF } from '../utils/downloadCertificateAsPDF';

interface CertificateDownloadButtonProps {
  elementId: string;
  filename: string;
}

const CertificateDownloadButton: React.FC<CertificateDownloadButtonProps> = ({ elementId, filename }) => {
  return (
    <button
      className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
      onClick={() => downloadCertificateAsPDF(elementId, filename)}
    >
      Download Certificate
    </button>
  );
};

export default CertificateDownloadButton;
