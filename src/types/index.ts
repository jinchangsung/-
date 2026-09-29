export type PlatformType = 'visa' | 'edu';
export type RoleType = 'user' | 'admin';
export type ViewMode = 'wireframe' | 'specs_table' | 'proposal_overview';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type Language = 'ko' | 'en';

export interface ScreenSpec {
  no: number;
  platform: '비자' | '평생교육원' | '공통';
  role: '사용자' | '관리자' | '공통';
  depth1: string;
  depth2: string;
  depth3?: string;
  screenId: string;
  screenType: 'Page' | 'List' | 'Detail' | 'Form' | 'CRUD Form' | 'Component' | 'Search' | 'Payment Popup' | 'Print/PDF' | 'Dashboard' | 'Grid/Detail' | 'List/Detail' | 'Form/List' | 'List/Form' | 'Batch Action' | 'Bulk SMS' | 'LMS Engine' | 'WAI-ARIA';
  multilingual: '국문/영문' | '국문' | '국/영문탭' | '공통' | '미반영';
  permission: '전체' | '신청자' | '수험생' | '수강생' | '관리자';
  description: string;
  uiComponent: string;
  detailedProcess: string;
  exceptionHandling: string;
  priority: 'High' | 'Medium' | 'Low';
  developmentPhase: '1차 개발' | '2차 연기' | '2차 이관';
}

export interface VisaCategory {
  code: string;
  nameKo: string;
  nameEn: string;
  category: '전문인력' | '투자/경영' | '유학/연수' | '거주/영주' | '취업';
  descriptionKo: string;
  descriptionEn: string;
  targetKo: string;
  targetEn: string;
  keyRequirementsKo: string[];
  keyRequirementsEn: string[];
  requiredDocsKo: string[];
  requiredDocsEn: string[];
  processKo: string[];
  processEn: string[];
  stayPeriod: string;
  badgeColor?: string;
}

export interface LawArchiveItem {
  id: string;
  titleKo: string;
  titleEn: string;
  category: '출입국관리법' | '시행규칙' | '법무부지침' | '외국인고용법' | '체류관리고시';
  promulgationDate: string;
  effectiveDate: string;
  docNumber: string;
  summaryKo: string;
  summaryEn: string;
  contentKo: string;
  contentEn: string;
  fileFormat: 'PDF' | 'HWP';
  fileSize: string;
  viewCount: number;
  downloadCount: number;
  status: 'published' | 'draft' | 'scheduled';
}

export interface EduCourse {
  id: string;
  title: string;
  category: '산재' | '비자' | '외국인정착설계사';
  type: '일반유료' | '고용보험환급';
  targetAudience: string;
  tuition: number;
  refundRate?: number; // e.g. 80%
  expectedRefundAmount?: number;
  capacity: number;
  currentEnrolled: number;
  status: '모집중' | '마감임박' | '마감';
  startDate: string;
  endDate: string;
  scheduleDescription: string;
  location: string;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  curriculum: {
    week: number;
    title: string;
    details: string;
    hours: number;
  }[];
  qualificationLinked?: string;
}

export interface CertificateInfo {
  code: string;
  title: string;
  organization: string;
  type: '민간자격(등록)' | '전문자격';
  overview: string;
  roadmap: string[];
  examSubjects: string[];
  passingScore: string;
  fee: number;
  nextExamDate: string;
  dDay: number;
}

export interface RegistrationRecord {
  id: string;
  regNumber: string;
  courseId: string;
  courseTitle: string;
  courseType: '일반유료' | '고용보험환급';
  applicantName: string;
  email: string;
  phone: string;
  companyName?: string;
  bizRegNumber?: string;
  paymentMethod: '신용카드' | '가상계좌' | 'PayPal';
  amount: number;
  paymentStatus: '결제완료' | '입금대기' | '환불완료';
  regDate: string;
  attendanceRate: number;
  completionStatus: '승인완료' | '심사중' | '미수료';
  certNumber?: string;
  certIssuedDate?: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  status: 'normal' | 'blinded';
  reportCount: number;
}
