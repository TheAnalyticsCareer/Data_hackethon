import React from 'react';
import companyLogo from '../image/6677da88a7c70751b1bf34a8.png';
import defaultSignature from '../image/sign.png'; // <-- Import your local signature image

interface CertificateProps {
  studentName: string;
  challengeName: string;
  signatureUrl?: string;
  date?: string;
}

const Certificate: React.FC<CertificateProps> = ({ studentName, challengeName, signatureUrl, date }) => {
  return (
    <div
      id="certificate"
      className="w-[800px] h-[600px] bg-white border-4 border-blue-700 rounded-xl shadow-2xl flex flex-col items-center justify-between p-12 relative font-serif mx-auto"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}
    >
      <img src={companyLogo} alt="Company Logo" className="h-16 absolute top-8 left-8" />
      <h1 className="text-4xl font-bold text-blue-800 mt-8">Certificate of Completion</h1>
      <p className="text-lg text-gray-700 mt-6">This is to certify that</p>
      <h2 className="text-3xl font-semibold text-blue-900 my-2">{studentName}</h2>
      <p className="text-lg text-gray-700">has successfully completed the challenge</p>
      <h3 className="text-2xl font-semibold text-blue-700 my-2">{challengeName}</h3>
      <p className="text-base text-gray-600 mt-4 mb-8">Awarded on {date || new Date().toLocaleDateString()}</p>

      <div className="flex items-center justify-between w-full px-8 mt-8">
        <div className="flex flex-col items-center ">
          <img
            src={signatureUrl || defaultSignature}
            alt="Signature"
            className="h-12 "
          />
          <span className="italic text-blue-800 font-bold text-lg mt-1">Analytics Career</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Company</span>
          <span className="text-blue-800 font-bold text-lg mt-1">Analytics Career</span>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
