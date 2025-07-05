
import React from 'react';
import { createRoot } from 'react-dom/client';
import { downloadCertificateAsPDF } from '../utils/downloadCertificateAsPDF';
import Certificate from './Certificate';

interface CertificateDownloadButtonProps {
  elementId: string;
  filename: string;
  studentName: string;
  challengeName: string;
}

const CertificateDownloadButton: React.FC<CertificateDownloadButtonProps> = ({ elementId, filename, studentName, challengeName }) => {

  const handleDownload = async () => {
    // Create a hidden container if not present
    let container = document.getElementById('hidden-certificate-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hidden-certificate-container';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.height = '600px';
      document.body.appendChild(container);
    }
    // Render Certificate into container
    const root = createRoot(container);
    root.render(
      <Certificate
        studentName={studentName}
        challengeName={challengeName}
        date={new Date().toLocaleDateString()}
      />
    );
    // Wait for DOM to update
    await new Promise(r => setTimeout(r, 100));
    await downloadCertificateAsPDF('certificate', filename);
    root.unmount();
    // Optionally remove the container
    container.remove();
  };

  return (
    <button
      className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
      onClick={handleDownload}
    >
      Download Certificate
    </button>
  );
};

export default CertificateDownloadButton;
