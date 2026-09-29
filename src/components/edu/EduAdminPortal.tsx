import React, { useState } from 'react';
import { EduCourse, RegistrationRecord } from '../../types';
import { EDU_COURSES, INITIAL_REGISTRATIONS } from '../../data/mockData';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Award, 
  Send, 
  Plus, 
  Download, 
  Check, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  Smartphone, 
  CheckCircle2, 
  Clock,
  Search,
  Filter
} from 'lucide-react';

interface EduAdminPortalProps {
  onScreenChange: (screenId: string) => void;
  activeScreenId: string;
}

export const EduAdminPortal: React.FC<EduAdminPortalProps> = ({
  onScreenChange,
  activeScreenId,
}) => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'courses' | 'applicants' | 'completion' | 'notifications'>('dashboard');
  const [courses, setCourses] = useState<EduCourse[]>(EDU_COURSES);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(INITIAL_REGISTRATIONS);

  // Filter States
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchApplicant, setSearchApplicant] = useState<string>('');

  // Course Edit Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<'산재' | '비자' | '외국인정착설계사'>('외국인정착설계사');
  const [newCourseType, setNewCourseType] = useState<'일반유료' | '고용보험환급'>('고용보험환급');
  const [newCourseTuition, setNewCourseTuition] = useState('420000');
  const [newCourseCapacity, setNewCourseCapacity] = useState('30');

  // SMS / AlimTalk Broadcast State (EDU-ADM-030)
  const [selectedCourseForSms, setSelectedCourseForSms] = useState<string>(EDU_COURSES[0].id);
  const [smsTemplate, setSmsTemplate] = useState<'reminder' | 'location' | 'materials'>('reminder');
  const [smsMessageContent, setSmsMessageContent] = useState('[피플평생교육원] OOO님, 신청하신 외국인정착설계사 과정 개강 3일 전입니다. 입실시간은 09:40까지이며 교재 및 필기도구가 제공됩니다.');
  const [smsSentNotice, setSmsSentNotice] = useState<string | null>(null);

  // Sync screen ID
  const handleTabChange = (tab: 'dashboard' | 'courses' | 'applicants' | 'completion' | 'notifications', screenId: string) => {
    setCurrentTab(tab);
    onScreenChange(screenId);
  };

  // Completion toggle (EDU-ADM-040)
  const toggleCompletionStatus = (regId: string) => {
    setRegistrations(registrations.map(r => {
      if (r.id === regId) {
        const isApproved = r.completionStatus === '승인완료';
        return {
          ...r,
          completionStatus: isApproved ? '미수료' : '승인완료',
          certNumber: isApproved ? undefined : (r.certNumber || '제2026-EDU-' + Math.floor(1000 + Math.random() * 9000) + '호'),
          certIssuedDate: isApproved ? undefined : new Date().toISOString().slice(0, 10),
        };
      }
      return r;
    }));
  };

  // Batch approve all eligible (attendance >= 80)
  const handleBatchApprove = () => {
    setRegistrations(registrations.map(r => {
      if (r.attendanceRate >= 80) {
        return {
          ...r,
          completionStatus: '승인완료',
          certNumber: r.certNumber || '제2026-EDU-' + Math.floor(1000 + Math.random() * 9000) + '호',
          certIssuedDate: r.certIssuedDate || new Date().toISOString().slice(0, 10),
        };
      }
      return r;
    }));
    alert('출석률 80% 이상 수강생 전원에 대해 수료가 일괄 승인되었으며 수료증 발급 권한이 부여되었습니다.');
  };

  // Add course (EDU-ADM-010)
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;
    const added: EduCourse = {
      id: 'CRS-' + Date.now(),
      title: newCourseTitle,
      category: newCourseCategory,
      type: newCourseType,
      targetAudience: '실무 재직자 및 자격 취득 희망자',
      tuition: parseInt(newCourseTuition, 10) || 400000,
      refundRate: newCourseType === '고용보험환급' ? 80 : undefined,
      expectedRefundAmount: newCourseType === '고용보험환급' ? Math.round((parseInt(newCourseTuition, 10) || 400000) * 0.8) : undefined,
      capacity: parseInt(newCourseCapacity, 10) || 30,
      currentEnrolled: 0,
      status: '모집중',
      startDate: '2026-11-01',
      endDate: '2026-12-05',
      scheduleDescription: '매주 토요일 10:00 ~ 17:00',
      location: '피플 평생교육원 세미나룸',
      instructorName: '초빙 전문교수',
      instructorTitle: '전문위원',
      instructorBio: '해당 실무 분야 전문 경력자',
      curriculum: [
        { week: 1, title: '기초 총론', details: '핵심 법령 및 실무 체계', hours: 6 },
        { week: 2, title: '심화 실무', details: '사례 연구 및 서식 작성', hours: 6 },
      ],
    };
    setCourses([...courses, added]);
    setIsCourseModalOpen(false);
    setNewCourseTitle('');
  };

  // Send Bulk SMS (EDU-ADM-030)
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    const count = registrations.filter(r => selectedCourseForSms === 'all' || r.courseId === selectedCourseForSms).length;
    setSmsSentNotice(`총 ${count}명의 수강생에게 리마인드 알림톡/SMS가 정상 발송되었습니다.`);
    setTimeout(() => setSmsSentNotice(null), 3500);
  };

  // Statistics calculation for EDU-ADM-001
  const totalRevenue = registrations
    .filter(r => r.paymentStatus === '결제완료')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalApplicants = registrations.length;
  const completedCount = registrations.filter(r => r.completionStatus === '승인완료').length;

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Navigation Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              EDU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  LIFELONG EDUCATION ADMIN SYSTEM
                </span>
                <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  {activeScreenId}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                평생교육원 운영·접수·결제·수료 통합 관리자
              </h2>
            </div>
          </div>

          {/* Section Selector */}
          <div className="flex flex-wrap bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => handleTabChange('dashboard', 'EDU-ADM-001')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>운영 현황 (001)</span>
            </button>
            <button
              onClick={() => handleTabChange('courses', 'EDU-ADM-010')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentTab === 'courses'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>개설 강좌 (010)</span>
            </button>
            <button
              onClick={() => handleTabChange('applicants', 'EDU-ADM-020')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentTab === 'applicants'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>접수/결제 (020)</span>
            </button>
            <button
              onClick={() => handleTabChange('completion', 'EDU-ADM-040')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentTab === 'completion'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>수료 판정 (040)</span>
            </button>
            <button
              onClick={() => handleTabChange('notifications', 'EDU-ADM-030')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentTab === 'notifications'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>알림 발송 (030)</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: OPERATIONAL DASHBOARD (EDU-ADM-001) ================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">총 누적 수강 결제액</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono-numbers block mt-1">
                  {totalRevenue.toLocaleString()}원
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">원스톱 결제 대사 완료</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">전체 수강 접수 인원</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono-numbers block mt-1">
                  {totalApplicants}명
                </span>
                <span className="text-[11px] text-blue-700 font-medium">환급과정 비중 75%</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">수료 승인 완료 건수</span>
                <span className="text-2xl font-extrabold text-emerald-900 font-mono-numbers block mt-1">
                  {completedCount}건
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">수료증 온라인 발급 연동</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">운영 강좌 평균 모집률</span>
                <span className="text-2xl font-extrabold text-amber-900 font-mono-numbers block mt-1">
                  82.3%
                </span>
                <span className="text-[11px] text-amber-700 font-medium">산재/설계사 정원 마감임박</span>
              </div>
            </div>

            {/* Course Enrollment Progress Bars */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                과목별 정원 대비 접수율 현황 (실시간 집계)
              </h3>
              <div className="space-y-3">
                {courses.map(course => {
                  const percent = Math.min(100, Math.round((course.currentEnrolled / course.capacity) * 100));
                  return (
                    <div key={course.id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="font-semibold text-slate-800">{course.title}</span>
                        <span className="font-mono text-slate-600">
                          {course.currentEnrolled} / {course.capacity}명 ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent >= 90 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COURSE MANAGEMENT CRUD (EDU-ADM-010) ================= */}
        {currentTab === 'courses' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  EDU-ADM-010
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  개설 강좌 관리 (등록 / 수정 / 마감)
                </h3>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>신규 강좌 개설</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">과목코드</th>
                    <th className="py-2.5 px-3">강좌명</th>
                    <th className="py-2.5 px-3">분야</th>
                    <th className="py-2.5 px-3">구분</th>
                    <th className="py-2.5 px-3">수강료</th>
                    <th className="py-2.5 px-3 text-center">정원/접수</th>
                    <th className="py-2.5 px-3 text-center">상태</th>
                    <th className="py-2.5 px-3 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono text-slate-500">{course.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{course.title}</td>
                      <td className="py-3 px-3">{course.category}</td>
                      <td className="py-3 px-3">{course.type}</td>
                      <td className="py-3 px-3 font-bold">{course.tuition.toLocaleString()}원</td>
                      <td className="py-3 px-3 text-center font-mono">
                        {course.currentEnrolled} / {course.capacity}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          course.status === '모집중' ? 'bg-emerald-50 text-emerald-700' :
                          course.status === '마감임박' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => alert(`[강좌 수정]\n과목명: ${course.title}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: APPLICANT LIST & EXCEL EXPORT (EDU-ADM-020) ================= */}
        {currentTab === 'applicants' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  EDU-ADM-020
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  수강생 접수 목록 및 결제 대사 관리
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('[엑셀 다운로드 완료]\n수강생 명부_20260929.xlsx 파일이 정상 다운로드되었습니다.\n(개인정보 보호 이력 로그 저장됨)')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>수강생 명부 엑셀 일괄 다운로드</span>
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">과목 필터:</span>
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                >
                  <option value="all">전체 과목 보기</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="신청자명 / 접수번호 검색..."
                  value={searchApplicant}
                  onChange={(e) => setSearchApplicant(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">접수번호</th>
                    <th className="py-2.5 px-3">수강 과목</th>
                    <th className="py-2.5 px-3">성명</th>
                    <th className="py-2.5 px-3">연락처</th>
                    <th className="py-2.5 px-3">소속 사업장</th>
                    <th className="py-2.5 px-3">결제수단</th>
                    <th className="py-2.5 px-3">납부액</th>
                    <th className="py-2.5 px-3 text-center">결제상태</th>
                    <th className="py-2.5 px-3 text-right">대사</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  {registrations
                    .filter(r => selectedCourseFilter === 'all' || r.courseId === selectedCourseFilter)
                    .filter(r => searchApplicant === '' || r.applicantName.includes(searchApplicant) || r.regNumber.includes(searchApplicant))
                    .map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{reg.regNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900 max-w-[200px] truncate">{reg.courseTitle}</td>
                        <td className="py-3 px-3 font-bold">{reg.applicantName}</td>
                        <td className="py-3 px-3 text-slate-500">{reg.phone}</td>
                        <td className="py-3 px-3 text-slate-600">{reg.companyName || '—'}</td>
                        <td className="py-3 px-3 font-mono">{reg.paymentMethod}</td>
                        <td className="py-3 px-3 font-bold">{reg.amount.toLocaleString()}원</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            reg.paymentStatus === '결제완료' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {reg.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => alert(`[결제 대사 확인]\n접수번호: ${reg.regNumber}\n입금 확인 완료 처리되었습니다.`)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px]"
                          >
                            입금확인
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CERTIFICATE ISSUANCE APPROVAL (EDU-ADM-040) ================= */}
        {currentTab === 'completion' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  EDU-ADM-040
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  수료 판정 및 온라인 수료증 발급 권한 부여
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  출석률 80% 이상 충족 수강생에 대해 승인 체크 시, 수강생 마이페이지에 공식 직인 수료증 출력 버튼이 즉시 활성화됩니다.
                </p>
              </div>

              <button
                onClick={handleBatchApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>출석 80% 이상 일괄 수료 승인</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">성명</th>
                    <th className="py-2.5 px-3">과정명</th>
                    <th className="py-2.5 px-3 text-center">출석률 (기준 80%)</th>
                    <th className="py-2.5 px-3">증서 등록번호</th>
                    <th className="py-2.5 px-3 text-center">수료 판정 상태</th>
                    <th className="py-2.5 px-3 text-right">발급 승인 토글</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{reg.applicantName}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{reg.courseTitle}</td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={reg.attendanceRate >= 80 ? 'text-emerald-700' : 'text-red-600'}>
                          {reg.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{reg.certNumber || '미부여'}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          reg.completionStatus === '승인완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {reg.completionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toggleCompletionStatus(reg.id)}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            reg.completionStatus === '승인완료'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {reg.completionStatus === '승인완료' ? '승인 취소 (출력 차단)' : '수료 승인 (출력 허용)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: BULK ALIMTALK / SMS SENDER (EDU-ADM-030) ================= */}
        {currentTab === 'notifications' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                EDU-ADM-030
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                사전 안내 및 단체 리마인드 알림톡 콘솔
              </h3>
            </div>

            {smsSentNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{smsSentNotice}</span>
              </div>
            )}

            <form onSubmit={handleSendSms} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">발송 대상 강좌 선택</label>
                <select
                  value={selectedCourseForSms}
                  onChange={(e) => setSelectedCourseForSms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800"
                >
                  <option value="all">전체 강좌 접수자</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">표준 템플릿 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSmsTemplate('reminder');
                      setSmsMessageContent('[피플평생교육원] OOO님, 신청하신 교육과정 개강 3일 전입니다. 입실시간(09:40)을 엄수해주시기 바랍니다.');
                    }}
                    className={`p-2 rounded border text-center ${smsTemplate === 'reminder' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'}`}
                  >
                    개강 D-3 입실안내
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsTemplate('location');
                      setSmsMessageContent('[피플평생교육원] 서울 서초구 사임당로 18길 피플빌딩 4층 대강의실 오시는 길 안내: 서초역 3번출구 도보 5분');
                    }}
                    className={`p-2 rounded border text-center ${smsTemplate === 'location' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'}`}
                  >
                    강의실 위치/약도
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsTemplate('materials');
                      setSmsMessageContent('[피플평생교육원] 강의 교재는 현장에서 배부되며, 개인 노트북 및 필기도구를 지참해주시기 바랍니다.');
                    }}
                    className={`p-2 rounded border text-center ${smsTemplate === 'materials' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200'}`}
                  >
                    준비물 사전 안내
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">메시지 본문 미리보기 (카카오 알림톡 / 통신사 SMS 폴백)</label>
                <textarea
                  rows={4}
                  value={smsMessageContent}
                  onChange={(e) => setSmsMessageContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-slate-800 font-sans"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>알림톡/SMS 단체 발송 실행</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* New Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">신규 오프라인 강좌 개설</h3>
            <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">과목명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 외국인 고용허가제 및 비자 심화과정"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">과정 구분</label>
                  <select
                    value={newCourseType}
                    onChange={(e: any) => setNewCourseType(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="고용보험환급">고용보험환급</option>
                    <option value="일반유료">일반유료</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">분야</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e: any) => setNewCourseCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="외국인정착설계사">외국인정착설계사</option>
                    <option value="비자">비자</option>
                    <option value="산재">산재</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">수강료 (원)</label>
                  <input
                    type="number"
                    value={newCourseTuition}
                    onChange={(e) => setNewCourseTuition(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">모집 정원 (명)</label>
                  <input
                    type="number"
                    value={newCourseCapacity}
                    onChange={(e) => setNewCourseCapacity(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  개설 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
