import React from 'react';
import { RegistrationRecord } from '../../types';
import { X, Printer, CheckCircle, Receipt, Building } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: RegistrationRecord;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">전자 결제 영수증 (EDU-USR-022)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 text-slate-800 space-y-4 text-xs font-mono">
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h3 className="text-base font-bold tracking-wider text-slate-950">재단법인 피플 평생교육원</h3>
            <span className="text-slate-500 text-[11px] block mt-0.5">교육비 납입 영수증 (공급받는자 보관용)</span>
          </div>

          <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">영수증 번호</span>
              <span className="font-semibold text-slate-900">{record.regNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">결제 일시</span>
              <span>{record.regDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">신청자 성명</span>
              <span className="font-semibold">{record.applicantName}</span>
            </div>
            {record.companyName && (
              <div className="flex justify-between">
                <span className="text-slate-500">사업장 명칭</span>
                <span>{record.companyName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">결제 수단</span>
              <span>{record.paymentMethod} (정상 승인)</span>
            </div>
          </div>

          <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between items-start">
              <span className="text-slate-500">강좌명</span>
              <span className="font-semibold text-right max-w-[200px]">{record.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">과정 유형</span>
              <span>{record.courseType}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 text-slate-950">
              <span>합계 납입액</span>
              <span>{record.amount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-1 leading-relaxed">
            사업자등록번호: 214-82-19402 | 대표자: 정승훈<br />
            서울특별시 서초구 사임당로 18길 23 (피플빌딩 4층)<br />
            문의전화: 02-588-1900 | 환불문의는 마이페이지 참조
          </div>
        </div>
      </div>
    </div>
  );
};
