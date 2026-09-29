import React, { useState } from 'react';
import { EduCourse } from '../../types';
import { 
  X, 
  CreditCard, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: EduCourse;
  applicantData: {
    name: string;
    phone: string;
    email: string;
    isRefund: boolean;
    companyName?: string;
  };
  onPaymentSuccess: (paymentInfo: {
    method: '신용카드' | '가상계좌' | 'PayPal';
    amount: number;
    transactionId: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  applicantData,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'신용카드' | '가상계좌' | 'PayPal'>('신용카드');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4579-2041-8891-3042');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [bankOption, setBankOption] = useState('국민은행');
  const [paypalEmail, setPaypalEmail] = useState('user@international.com');
  const [termsAgreed, setTermsAgreed] = useState(true);

  if (!isOpen) return null;

  const actualTuition = applicantData.isRefund && course.type === '고용보험환급'
    ? (course.tuition - (course.expectedRefundAmount || 0))
    : course.tuition;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomTx = 'PG-TX-' + Math.floor(100000 + Math.random() * 900000);
      onPaymentSuccess({
        method: selectedMethod,
        amount: actualTuition,
        transactionId: randomTx,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* PG Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-slate-300">SECURE PG GATEWAY</span>
                <span className="font-mono text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded">EDU-USR-021</span>
              </div>
              <h3 className="text-sm font-bold text-white">평생교육원 다각화 원스톱 결제</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold text-slate-800 text-sm block">{course.title}</span>
              <span className="text-slate-500">
                수강신청자: {applicantData.name} ({applicantData.phone})
              </span>
            </div>
            <div className="text-right">
              {applicantData.isRefund && course.type === '고용보험환급' ? (
                <div>
                  <span className="line-through text-slate-400 block text-[11px]">
                    정가 {course.tuition.toLocaleString()}원
                  </span>
                  <span className="font-bold text-emerald-700 text-base">
                    실 결제금액 {actualTuition.toLocaleString()}원
                  </span>
                  <span className="text-[10px] text-emerald-600 block">(사업주 환급 80% 적용)</span>
                </div>
              ) : (
                <span className="font-bold text-slate-900 text-base">
                  {actualTuition.toLocaleString()}원
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              결제 수단 선택 (원스톱 다각화 연동)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('신용카드')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedMethod === '신용카드'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1.5 text-blue-600" />
                <span>국내 신용카드</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('가상계좌')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedMethod === '가상계좌'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-5 h-5 mb-1.5 text-slate-700" />
                <span>무통장(가상계좌)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PayPal')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedMethod === 'PayPal'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Globe2 className="w-5 h-5 mb-1.5 text-indigo-600" />
                <span>PayPal (해외/외국인)</span>
              </button>
            </div>
          </div>

          {/* Method Specific Form */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
            {selectedMethod === '신용카드' && (
              <>
                <div>
                  <label className="block text-slate-600 mb-1">카드 번호</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 font-mono text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">유효기간 (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">할부 선택</label>
                    <select className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800">
                      <option>일시불</option>
                      <option>2개월 무이자</option>
                      <option>3개월 무이자</option>
                      <option>6개월</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedMethod === '가상계좌' && (
              <>
                <div>
                  <label className="block text-slate-600 mb-1">입금 은행 선택</label>
                  <select
                    value={bankOption}
                    onChange={(e) => setBankOption(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800"
                  >
                    <option>국민은행</option>
                    <option>신한은행</option>
                    <option>하나은행</option>
                    <option>우리은행</option>
                    <option>기업은행</option>
                  </select>
                </div>
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 text-[11px] leading-relaxed">
                  신청 완료 즉시 고유 가상계좌번호가 발급되며, 개강 3일 전까지 입금 시 최종 접수 완료됩니다. (현금영수증 및 세금계산서 자동 발행)
                </div>
              </>
            )}

            {selectedMethod === 'PayPal' && (
              <>
                <div>
                  <label className="block text-slate-600 mb-1">PayPal Account Email</label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 font-mono text-slate-800"
                  />
                </div>
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded text-indigo-900 text-[11px] leading-relaxed">
                  International participants can pay directly in USD/KRW via PayPal secure sandbox gateway.
                </div>
              </>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="pay-terms"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pay-terms" className="text-[11px] text-slate-600 leading-tight">
              평생교육법 환불 규정 및 수강 취소 정책에 동의하며, 결제 대행 서비스 이용 약관에 동의합니다.
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL 암호화</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              disabled={isProcessing || !termsAgreed}
              onClick={handlePay}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>결제 승인 처리 중...</span>
                </>
              ) : (
                <>
                  <span>{actualTuition.toLocaleString()}원 결제하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
