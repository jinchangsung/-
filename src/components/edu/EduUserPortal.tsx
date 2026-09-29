import React, { useState } from 'react';
import { EduCourse, CertificateInfo, RegistrationRecord } from '../../types';
import { 
  EDU_COURSES, 
  CERTIFICATE_INFO, 
  INITIAL_REGISTRATIONS 
} from '../../data/mockData';
import { PaymentModal } from '../common/PaymentModal';
import { CertificateModal } from '../common/CertificateModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Award, 
  Users, 
  FileText, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  MapPin, 
  DollarSign, 
  HelpCircle, 
  Printer, 
  RotateCcw, 
  MessageSquare, 
  Bell, 
  Building, 
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface EduUserPortalProps {
  onScreenChange: (screenId: string) => void;
  activeScreenId: string;
}

export const EduUserPortal: React.FC<EduUserPortalProps> = ({
  onScreenChange,
  activeScreenId,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'courses' | 'apply' | 'cert_intro' | 'exams' | 'faculty' | 'community' | 'mypage'>('main');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('CRS-2026-01');
  const [courseTypeFilter, setCourseTypeFilter] = useState<'all' | '일반유료' | '고용보험환급'>('all');
  
  // Registration flow state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [activeReceiptRecord, setActiveReceiptRecord] = useState<RegistrationRecord>(INITIAL_REGISTRATIONS[0]);
  const [activeCertRecord, setActiveCertRecord] = useState<RegistrationRecord>(INITIAL_REGISTRATIONS[0]);

  // Form Fields for Application (EDU-USR-020)
  const [applicantName, setApplicantName] = useState('홍길동');
  const [applicantPhone, setApplicantPhone] = useState('010-8849-2041');
  const [applicantEmail, setApplicantEmail] = useState('gildong.hong@gmail.com');
  const [isRefundType, setIsRefundType] = useState(true);
  const [companyName, setCompanyName] = useState('(주)한국글로벌네트워크');
  const [bizRegNumber, setBizRegNumber] = useState('120-81-99401');
  const [companyManagerPhone, setCompanyManagerPhone] = useState('02-3488-9100');

  // Success state for (EDU-USR-022)
  const [completedRegistration, setCompletedRegistration] = useState<RegistrationRecord | null>(null);

  // My Page List of Registrations
  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>(INITIAL_REGISTRATIONS);

  // Sync activeScreenId when tab changes
  const handleTabChange = (tab: 'main' | 'courses' | 'apply' | 'cert_intro' | 'exams' | 'faculty' | 'community' | 'mypage', screenId: string) => {
    setActiveTab(tab);
    onScreenChange(screenId);
  };

  const currentCourse = EDU_COURSES.find(c => c.id === selectedCourseId) || EDU_COURSES[0];

  const handleStartApply = (course: EduCourse) => {
    setSelectedCourseId(course.id);
    setIsRefundType(course.type === '고용보험환급');
    handleTabChange('apply', 'EDU-USR-020');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !applicantEmail) {
      alert('신청자 필수 항목(성명, 연락처, 이메일)을 입력해주세요.');
      return;
    }
    if (isRefundType && !companyName) {
      alert('고용보험환급 과정 신청 시 소속 사업장 명칭을 입력해주세요.');
      return;
    }
    setIsPaymentModalOpen(true);
    onScreenChange('EDU-USR-021');
  };

  const handlePaymentSuccess = (paymentInfo: {
    method: '신용카드' | '가상계좌' | 'PayPal';
    amount: number;
    transactionId: string;
  }) => {
    setIsPaymentModalOpen(false);
    const newReg: RegistrationRecord = {
      id: 'REG-' + Date.now(),
      regNumber: 'EDU-2026-' + Math.floor(1000 + Math.random() * 9000),
      courseId: currentCourse.id,
      courseTitle: currentCourse.title,
      courseType: isRefundType ? '고용보험환급' : '일반유료',
      applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      companyName: isRefundType ? companyName : undefined,
      bizRegNumber: isRefundType ? bizRegNumber : undefined,
      paymentMethod: paymentInfo.method,
      amount: paymentInfo.amount,
      paymentStatus: paymentInfo.method === '가상계좌' ? '입금대기' : '결제완료',
      regDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      attendanceRate: 0,
      completionStatus: '심사중',
    };

    setMyRegistrations([newReg, ...myRegistrations]);
    setCompletedRegistration(newReg);
    setActiveReceiptRecord(newReg);
    handleTabChange('apply', 'EDU-USR-022');
  };

  const handleOpenCertificate = (record: RegistrationRecord) => {
    if (record.completionStatus !== '승인완료') {
      alert('출석률 80% 이상 충족 및 관리자 수료 판정이 승인된 건에 한하여 수료증 출력이 가능합니다.');
      return;
    }
    setActiveCertRecord(record);
    setIsCertificateModalOpen(true);
    onScreenChange('EDU-USR-071');
  };

  const handleOpenReceipt = (record: RegistrationRecord) => {
    setActiveReceiptRecord(record);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      {/* Sub-Header (Education GNB) */}
      <nav className="bg-white border-b border-slate-200 sticky top-[97px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleTabChange('main', 'EDU-USR-001')}
                className="text-left group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    피플
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 block tracking-tight">
                      재단법인 피플 평생교육원
                    </span>
                    <span className="text-[10px] text-slate-500 block -mt-1 hidden sm:block">
                      산재·비자·외국인정착설계사 원스톱 전문 교육 및 자격검정
                    </span>
                  </div>
                </div>
              </button>

              <div className="hidden md:flex items-center gap-1 text-xs font-medium">
                <button
                  onClick={() => handleTabChange('main', 'EDU-USR-001')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'main' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  홈 (메인)
                </button>
                <button
                  onClick={() => handleTabChange('courses', 'EDU-USR-010')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'courses' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  강의소개 (일반/환급)
                </button>
                <button
                  onClick={() => handleTabChange('cert_intro', 'EDU-USR-030')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'cert_intro' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  자격증 종목 안내
                </button>
                <button
                  onClick={() => handleTabChange('exams', 'EDU-USR-040')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'exams' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  자격시험 일정/접수
                </button>
                <button
                  onClick={() => handleTabChange('faculty', 'EDU-USR-050')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'faculty' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  튜터/교수진
                </button>
                <button
                  onClick={() => handleTabChange('community', 'EDU-USR-060')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'community' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  커뮤니티/자료실
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabChange('mypage', 'EDU-USR-070')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'mypage'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>나의 접수/증서 출력 센터</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ================= TAB 1: MAIN DASHBOARD (EDU-USR-001) ================= */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            {/* Top Recruitment Hero Carousel Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                  2026 하반기 신규 개설 수강생 모집
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  산재·비자·외국인정착설계사 전문가 양성과정
                </h2>
                <p className="text-xs text-slate-200 leading-relaxed">
                  현직 노무사·행정사 직강 오프라인 실무 교육 | 고용보험 환급과정 최대 80% 지원 | 원스톱 수료증 및 자격증 온라인 즉시 발급
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleTabChange('courses', 'EDU-USR-010')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>개설 과목 전체보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleTabChange('exams', 'EDU-USR-040')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs transition-colors border border-white/20"
                  >
                    <span>자격시험 D-Day 캘린더</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Core Courses Grid & Exam D-Day Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Core Courses (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-base font-bold text-slate-900">
                      모집 중인 3대 핵심 전문 교육과정
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    오프라인 정규과정 (추후 신규과목 지속 증설)
                  </span>
                </div>

                <div className="space-y-3">
                  {EDU_COURSES.map((course) => (
                    <div
                      key={course.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className={`font-semibold px-2 py-0.5 rounded ${
                            course.type === '고용보험환급'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {course.type}
                          </span>
                          <span className="font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {course.category}
                          </span>
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            course.status === '모집중' ? 'bg-emerald-100 text-emerald-800' :
                            course.status === '마감임박' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {course.status}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h4>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {course.startDate} ~ {course.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            강사: {course.instructorName}
                          </span>
                          <span className="font-mono text-slate-600">
                            모집률: {course.currentEnrolled}/{course.capacity}명 ({Math.round(course.currentEnrolled/course.capacity*100)}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4 flex sm:flex-col justify-between items-end gap-2">
                        <div>
                          {course.type === '고용보험환급' && course.expectedRefundAmount ? (
                            <div>
                              <span className="text-[10px] line-through text-slate-400 block">
                                {course.tuition.toLocaleString()}원
                              </span>
                              <span className="text-sm font-bold text-emerald-700">
                                실부담 {(course.tuition - course.expectedRefundAmount).toLocaleString()}원
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-900">
                              {course.tuition.toLocaleString()}원
                            </span>
                          )}
                        </div>

                        <button
                          disabled={course.status === '마감'}
                          onClick={() => handleStartApply(course)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                        >
                          {course.status === '마감' ? '접수 마감' : '원스톱 수강신청'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam D-Day Widget & AlimTalk Card (1 col) */}
              <div className="space-y-6">
                {/* Exam D-Day Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>자격시험 D-Day 캘린더</span>
                    </div>
                    <span className="text-[11px] text-slate-400">EDU-USR-040</span>
                  </div>

                  {CERTIFICATE_INFO.map(cert => (
                    <div key={cert.code} className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-950">{cert.title}</span>
                        <span className="font-mono text-xs font-black text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded">
                          D-{cert.dDay}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span>시험일: {cert.nextExamDate}</span>
                        <span className="font-mono">응시료 {cert.fee.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleTabChange('exams', 'EDU-USR-040')}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors text-center"
                  >
                    원서접수 바로가기
                  </button>
                </div>

                {/* Refund Notice Card */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-emerald-950">
                  <span className="font-bold flex items-center gap-1 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>고용보험 환급과정 신청 안내</span>
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    사업주 직업능력개발훈련 위탁계약 체결 시 훈련비의 최대 80%가 사업장 계좌로 환급됩니다. (출석률 80% 이상 필수)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COURSE INTRO & SYLLABUS (EDU-USR-010) ================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    EDU-USR-010
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    전문 교육과정 안내 및 세부 커리큘럼
                  </h2>
                </div>

                {/* Course Type Filter Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
                  {(['all', '일반유료', '고용보험환급'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setCourseTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        courseTypeFilter === type
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {type === 'all' ? '전체 과정' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EDU_COURSES
                  .filter(c => courseTypeFilter === 'all' || c.type === courseTypeFilter)
                  .map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourseId(c.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedCourseId === c.id
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-emerald-800">{c.category}</span>
                        <span className="font-mono text-slate-500">{c.type}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{c.title}</h4>
                      <div className="text-[11px] font-bold text-emerald-700 mt-2">
                        {c.tuition.toLocaleString()}원
                      </div>
                    </div>
                  ))}
              </div>

              {/* Course Detail & Weekly Syllabus */}
              <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{currentCourse.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      교육 대상: {currentCourse.targetAudience} | 일정: {currentCourse.scheduleDescription}
                    </p>
                  </div>
                  <button
                    disabled={currentCourse.status === '마감'}
                    onClick={() => handleStartApply(currentCourse)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    {currentCourse.status === '마감' ? '마감됨' : '본 과정 수강신청하기'}
                  </button>
                </div>

                {/* Instructor Profile Row */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    {currentCourse.instructorName.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      담당 강사진: {currentCourse.instructorName} ({currentCourse.instructorTitle})
                    </span>
                    <p className="text-[11px] text-slate-500">{currentCourse.instructorBio}</p>
                  </div>
                </div>

                {/* Weekly Syllabus Accordion */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    주차별 상세 교육 커리큘럼 (Syllabus)
                  </h4>
                  <div className="space-y-2">
                    {currentCourse.curriculum.map((item) => (
                      <div key={item.week} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3 text-xs">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                          {item.week}주차 ({item.hours}h)
                        </span>
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-900">{item.title}</h5>
                          <p className="text-slate-500 text-[11px]">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ONE-STOP APPLICATION & PG PAYMENT (EDU-USR-020 ~ 022) ================= */}
        {activeTab === 'apply' && (
          <div className="space-y-6">
            {completedRegistration ? (
              /* EDU-USR-022: Result View */
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl mx-auto text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    EDU-USR-022
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    수강 신청 및 결제가 정상 완료되었습니다!
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    접수 안내 및 강의실 약도 알림톡이 신청자 휴대전화({completedRegistration.phone})로 자동 전송되었습니다.
                  </p>
                </div>

                {/* Summary Ticket */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">접수 번호</span>
                    <span className="font-bold text-slate-900">{completedRegistration.regNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">수강 과목</span>
                    <span className="font-semibold text-slate-900">{completedRegistration.courseTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">신청인</span>
                    <span>{completedRegistration.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">결제 금액 / 수단</span>
                    <span className="font-bold text-emerald-700">
                      {completedRegistration.amount.toLocaleString()}원 ({completedRegistration.paymentMethod})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">결제 상태</span>
                    <span className="text-emerald-700 font-semibold">{completedRegistration.paymentStatus}</span>
                  </div>
                </div>

                {/* Simulated Kakao AlimTalk Banner */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-left text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>[카카오 알림톡 실시간 발송 완료 알림]</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    [피플평생교육원] {completedRegistration.applicantName}님, {completedRegistration.courseTitle} 접수가 완료되었습니다. 개강 3일 전 강의실 호수 및 사전 준비물 안내 메시지가 추가 발송됩니다.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleOpenReceipt(completedRegistration)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>전자 영수증 출력</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('mypage', 'EDU-USR-070')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <span>마이페이지 접수내역 보기</span>
                  </button>
                </div>
              </div>
            ) : (
              /* EDU-USR-020: Application Form */
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl mx-auto space-y-5">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    EDU-USR-020 / EDU-USR-021
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    원스톱 수강신청서 작성 & 결제
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    선택 과목: <strong className="text-slate-800">{currentCourse.title}</strong>
                  </p>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
                  {/* Step 1: Course Type */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">수강 유형 선택</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="refundToggle"
                          checked={!isRefundType}
                          onChange={() => setIsRefundType(false)}
                          className="text-emerald-600"
                        />
                        <span>일반 유료 과정 ({currentCourse.tuition.toLocaleString()}원)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="refundToggle"
                          checked={isRefundType}
                          onChange={() => setIsRefundType(true)}
                          className="text-emerald-600"
                        />
                        <span className="text-emerald-800 font-semibold">
                          고용보험 환급과정 (실부담 {(currentCourse.tuition - (currentCourse.expectedRefundAmount || 0)).toLocaleString()}원)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Step 2: Personal Info */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1">
                      1. 수강생 인적사항 (필수)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">성명 (실명)</label>
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">휴대전화번호 (알림톡 수신)</label>
                        <input
                          type="text"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">이메일 주소 (수료증 및 결제확인서)</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Step 3: Business Info for Refund Course */}
                  {isRefundType && (
                    <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                      <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-emerald-600" />
                        <span>2. 고용보험 환급 기업정보 (사업주 직능훈련)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 mb-1">소속 사업장명</label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1">사업자등록번호</label>
                          <input
                            type="text"
                            value={bizRegNumber}
                            onChange={(e) => setBizRegNumber(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      신용카드 / 가상계좌 / PayPal 원스톱 PG 연동
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>결제창 호출 (EDU-USR-021)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: QUALIFICATION INFO (EDU-USR-030) ================= */}
        {activeTab === 'cert_intro' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  EDU-USR-030
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  자격 종목 안내 및 자격 취득 로드맵
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  다문화·이민자 체류 행정 및 산재 권익구제를 담당하는 공인 전문 자격제도입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CERTIFICATE_INFO.map(cert => (
                  <div key={cert.code} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="text-base font-bold text-slate-900">{cert.title}</h3>
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {cert.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{cert.overview}</p>

                    {/* 4-Step Roadmap */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-800 block">취득 로드맵 (Roadmap)</span>
                      <div className="space-y-1">
                        {cert.roadmap.map((step, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs text-slate-700">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exam Subjects */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">검정 과목 및 합격 기준</span>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        {cert.examSubjects.map((sub, i) => (
                          <li key={i}>{sub}</li>
                        ))}
                      </ul>
                      <span className="text-[11px] text-emerald-700 font-semibold block pt-1">
                        기준: {cert.passingScore} (응시료 {cert.fee.toLocaleString()}원)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: EXAM SCHEDULE & APPLICATION (EDU-USR-040) ================= */}
        {activeTab === 'exams' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                EDU-USR-040
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                2026년도 자격검정 시험 일정 및 원서접수
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">회차</th>
                    <th className="py-2.5 px-3">자격 종목</th>
                    <th className="py-2.5 px-3">원서 접수 기간</th>
                    <th className="py-2.5 px-3">시험 일자</th>
                    <th className="py-2.5 px-3">합격자 발표</th>
                    <th className="py-2.5 px-3 text-right">원서 접수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold">제12회</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">외국인정착설계사 (1급/2급)</td>
                    <td className="py-3 px-3 text-slate-500">2026. 10. 01 ~ 10. 30</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">2026. 11. 28 (토)</td>
                    <td className="py-3 px-3 text-slate-500">2026. 12. 10</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert('[원서접수 시뮬레이션]\n외국인정착설계사 제12회 원서 접수창으로 연결됩니다.')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition-colors"
                      >
                        원서접수
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold">제08회</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">외국인 산재보상실무지도사</td>
                    <td className="py-3 px-3 text-slate-500">2026. 09. 15 ~ 10. 20</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">2026. 11. 14 (토)</td>
                    <td className="py-3 px-3 text-slate-500">2026. 11. 25</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert('[원서접수 시뮬레이션]\n산재보상실무지도사 제08회 원서 접수창으로 연결됩니다.')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition-colors"
                      >
                        원서접수
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: FACULTY PROFILES (EDU-USR-050) ================= */}
        {activeTab === 'faculty' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                EDU-USR-050
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                전임 교수진 및 현직 전문가 튜터 소개
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '최성호 교수', title: '다문화정책연구원 수석연구위원 / 행정학 박사', field: '외국인정착설계사 과정 총괄', books: '외국인 체류정책론, 이민 다문화 행정 실무' },
                { name: '박선영 대표행정사', title: '비자출입국전문행정사사무소 대표', field: '출입국 비자 행정 실무', books: '대한민국 비자 올인원 마스터 (2026 최신개정판)' },
                { name: '김민우 대표노무사', title: '노무법인 한결 대표노무사', field: '외국인 산재보상 및 권익구제', books: '외국인 근로자 산재보상 실무 가이드' },
              ].map((faculty, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg mx-auto">
                    {faculty.name.slice(0, 2)}
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-slate-900">{faculty.name}</h4>
                    <span className="text-xs text-emerald-700 font-medium">{faculty.title}</span>
                  </div>
                  <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">담당 분야: </span>
                      {faculty.field}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">주요 저서: </span>
                      {faculty.books}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: COMMUNITY (EDU-USR-060) ================= */}
        {activeTab === 'community' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                EDU-USR-060
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                커뮤니티 및 통합 강의자료실
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: '[공지] 2026 하반기 오프라인 강의실 입실시간 및 주차 안내', date: '2026-09-28', author: '교육운영팀' },
                { title: '[자료] 외국인정착설계사 1급 실기평가 서식 작성 가이드라인 (PDF)', date: '2026-09-25', author: '최성호 교수' },
                { title: '[자료] 산재 요양급여 신청서 및 재해경위서 표준 양식', date: '2026-09-20', author: '김민우 노무사' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 hover:text-emerald-700 cursor-pointer">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>{item.author}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: MY PAGE & CERTIFICATE CENTER (EDU-USR-070 & 071) ================= */}
        {activeTab === 'mypage' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    EDU-USR-070 / EDU-USR-071
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    나의 접수 내역 및 온라인 증서 출력 센터
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    수료 승인이 완료된 과정은 공식 직인이 날인된 수료증을 즉시 인쇄/PDF 저장할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Registrations List */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">접수번호</th>
                      <th className="py-2.5 px-3">신청 과정명</th>
                      <th className="py-2.5 px-3">과정 구분</th>
                      <th className="py-2.5 px-3">결제 금액</th>
                      <th className="py-2.5 px-3 text-center">출석률</th>
                      <th className="py-2.5 px-3 text-center">수료 상태</th>
                      <th className="py-2.5 px-3 text-right">증서/영수증 출력</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono-numbers">
                    {myRegistrations.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{rec.regNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{rec.courseTitle}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            rec.courseType === '고용보험환급'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {rec.courseType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">
                          {rec.amount.toLocaleString()}원
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-slate-700">{rec.attendanceRate}%</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            rec.completionStatus === '승인완료'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.completionStatus === '심사중'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {rec.completionStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenReceipt(rec)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                          >
                            영수증
                          </button>
                          <button
                            disabled={rec.completionStatus !== '승인완료'}
                            onClick={() => handleOpenCertificate(rec)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded text-[11px] font-bold transition-colors"
                          >
                            수료증 출력
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={currentCourse}
        applicantData={{
          name: applicantName,
          phone: applicantPhone,
          email: applicantEmail,
          isRefund: isRefundType,
          companyName: isRefundType ? companyName : undefined,
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        record={activeReceiptRecord}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        record={activeCertRecord}
      />
    </div>
  );
};
