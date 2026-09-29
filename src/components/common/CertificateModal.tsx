import React from 'react';
import { RegistrationRecord } from '../../types';
import { X, Printer, Download, Award, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: RegistrationRecord;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen) return null;

  const isQualification = record.courseTitle.includes('외국인정착설계사');
  const certNumber = record.certNumber || '제2026-EDU-0418호';
  const issueDate = record.certIssuedDate || '2026년 09월 29일';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">증서 온라인 발급 센터 (EDU-USR-071)</span>
            <span className="font-mono text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">
              공식 직인 인증 완료
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>수료증 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Sheet (Styled like official Korean certificate) */}
        <div className="p-8 sm:p-12 bg-[#fffdfa] border-8 border-double border-slate-700 relative text-slate-900 m-4 rounded shadow-sm">
          {/* Decorative Corner Borders */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-800" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-800" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-800" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-800" />

          {/* Certificate Number */}
          <div className="flex justify-between items-center text-xs text-slate-600 mb-6 font-mono">
            <span>등록번호: {certNumber}</span>
            <span>교육과정 인증: 평생교육법 제23조</span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-widest text-slate-950 font-serif mb-2">
              {isQualification ? '자 격 증 서' : '수 료 증'}
            </h1>
            <p className="text-xs tracking-wider text-slate-500 uppercase font-mono">
              {isQualification ? 'Certificate of Qualification' : 'Certificate of Completion'}
            </p>
          </div>

          {/* Recipient Details */}
          <div className="space-y-4 my-8 text-sm">
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">성 명 :</span>
              <span className="col-span-3 font-bold text-slate-900 text-base">{record.applicantName}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">생 년 월 일 :</span>
              <span className="col-span-3 text-slate-800 font-mono">1988년 04월 15일</span>
            </div>
            {record.companyName && (
              <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">소 속 :</span>
                <span className="col-span-3 text-slate-800">{record.companyName}</span>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">교 육 과 정 :</span>
              <span className="col-span-3 font-semibold text-slate-900">{record.courseTitle}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">교 육 기 간 :</span>
              <span className="col-span-3 text-slate-800 font-mono">2026. 08. 15 ~ 2026. 09. 25 (총 36시간 이수)</span>
            </div>
          </div>

          {/* Statement */}
          <div className="text-center my-8 leading-relaxed text-sm text-slate-800 font-serif">
            <p>
              위 사람은 재단법인 피플 평생교육원에서 주관하는<br />
              위 교육과정을 성실히 이수하고 소정의 자격 검정 평가에 합격하였으므로<br />
              본 증서를 수여합니다.
            </p>
          </div>

          {/* Issue Date */}
          <div className="text-center my-6 text-sm font-semibold text-slate-800">
            {issueDate}
          </div>

          {/* Issuer Lockup with Official Seal */}
          <div className="mt-8 pt-4 flex items-center justify-center relative">
            <div className="text-center">
              <span className="text-lg font-extrabold tracking-wider text-slate-950 block">
                재단법인 피플 평생교육원장
              </span>
              <span className="text-xs text-slate-500 block">이사장 정 승 훈</span>
            </div>

            {/* Red Circular Seal Stamp */}
            <div className="absolute right-12 sm:right-24 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-red-600/90 flex items-center justify-center text-red-600 font-serif font-extrabold text-[13px] leading-tight text-center rotate-[-8deg] pointer-events-none select-none shadow-xs bg-red-50/20 backdrop-blur-[0.5px]">
              재단법인<br />피플평생<br />교육원인
            </div>
          </div>

          {/* Bottom Security Mark */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>위변조 방지 코드: 9942-F81A-2026</span>
            <span>진위확인: https://edu.people.or.kr/verify</span>
          </div>
        </div>
      </div>
    </div>
  );
};
