import React, { useState } from 'react';
import { Language, VisaCategory, LawArchiveItem, CommentItem } from '../../types';
import { 
  VISA_CATEGORIES, 
  LAW_ARCHIVE_DATA, 
  INITIAL_COMMENTS, 
  I18N 
} from '../../data/mockData';
import { 
  Search, 
  FileText, 
  Download, 
  Globe, 
  Share2, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink, 
  BookOpen, 
  Users, 
  Building, 
  Calendar, 
  ChevronRight, 
  ShieldAlert, 
  Send,
  Video,
  FileCheck,
  Eye,
  Filter
} from 'lucide-react';

interface VisaUserPortalProps {
  language: Language;
  onScreenChange: (screenId: string) => void;
  activeScreenId: string;
}

export const VisaUserPortal: React.FC<VisaUserPortalProps> = ({
  language,
  onScreenChange,
  activeScreenId,
}) => {
  const t = I18N[language];
  const [activeTab, setActiveTab] = useState<'main' | 'category' | 'laws' | 'forms' | 'about' | 'media'>('main');
  const [selectedVisaCode, setSelectedVisaCode] = useState<string>('E-7');
  const [selectedLawId, setSelectedLawId] = useState<string>('LAW-2026-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [lawCategoryFilter, setLawCategoryFilter] = useState<string>('all');
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Sync activeScreenId when tab changes
  const handleTabChange = (tab: 'main' | 'category' | 'laws' | 'forms' | 'about' | 'media', screenId: string) => {
    setActiveTab(tab);
    onScreenChange(screenId);
  };

  const currentVisa = VISA_CATEGORIES.find(v => v.code === selectedVisaCode) || VISA_CATEGORIES[0];
  const currentLaw = LAW_ARCHIVE_DATA.find(l => l.id === selectedLawId) || LAW_ARCHIVE_DATA[0];

  const filteredLaws = LAW_ARCHIVE_DATA.filter(law => {
    const matchesCategory = lawCategoryFilter === 'all' || law.category === lawCategoryFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      law.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.summaryKo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;
    const newCmt: CommentItem = {
      id: 'CMT-' + Date.now(),
      postId: selectedLawId,
      author: newCommentAuthor.trim() || (language === 'ko' ? '익명 상담자' : 'Anonymous Guest'),
      content: newCommentContent.trim(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'normal',
      reportCount: 0,
    };
    setComments([newCmt, ...comments]);
    setNewCommentContent('');
    setNewCommentAuthor('');
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      {/* Platform Sub-Header (GNB) */}
      <nav className="bg-white border-b border-slate-200 sticky top-[97px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleTabChange('main', 'VIS-USR-001')}
                className="text-left group"
              >
                <span className="text-base font-bold text-blue-900 group-hover:text-blue-700 block tracking-tight">
                  {t.platformName}
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 hidden sm:block">
                  {t.tagline}
                </span>
              </button>

              <div className="hidden md:flex items-center gap-1 text-xs font-medium">
                <button
                  onClick={() => handleTabChange('main', 'VIS-USR-001')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'main' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navHome}
                </button>
                <button
                  onClick={() => handleTabChange('category', 'VIS-USR-010')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'category' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navCategories}
                </button>
                <button
                  onClick={() => handleTabChange('laws', 'VIS-USR-012')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'laws' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navLaws}
                </button>
                <button
                  onClick={() => handleTabChange('forms', 'VIS-USR-040')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'forms' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navForms}
                </button>
                <button
                  onClick={() => handleTabChange('about', 'VIS-USR-020')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'about' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navAbout}
                </button>
                <button
                  onClick={() => handleTabChange('media', 'VIS-USR-050')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'media' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.navMedia}
                </button>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative w-44 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'laws') {
                      setActiveTab('laws');
                      onScreenChange('VIS-USR-070');
                    }
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ================= TAB 1: MAIN DASHBOARD (VIS-USR-001) ================= */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            {/* Rolling Law Ticker Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse">
                  LATEST LAW / 최신고시
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-100 max-w-2xl line-clamp-1">
                  {language === 'ko'
                    ? '출입국관리법 시행규칙 제23조 개정: E-7-4 숙련기능인력 연간 쿼터 4.5만 명 확대 및 지자체 추천제 도입'
                    : 'Immigration Control Act Revision: Expansion of E-7-4 skilled worker quota to 45,000 annually with provincial incentives'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedLawId('LAW-2026-001');
                  handleTabChange('laws', 'VIS-USR-013');
                }}
                className="flex items-center gap-1 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/20 whitespace-nowrap"
              >
                <span>{t.viewDetails}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hero Quick Search & Visa Status Overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">
                  {language === 'ko' ? '체류자격 종합 아카이브' : 'COMPREHENSIVE VISA REPOSITORY'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {language === 'ko'
                    ? '대한민국 비자 요건, 구비서류 및 개정 법령 안내'
                    : 'Authoritative Korea Visa Requirements & Statutory Guidelines'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === 'ko'
                    ? '전문인력(E-7), 외국인투자(D-8), 유학(D-2), 우수인재거주(F-2) 등 주요 체류자격의 공식 지침을 실시간 확인하세요.'
                    : 'Access verified requirements, procedural roadmaps, and official government application forms.'}
                </p>
              </div>

              {/* Quick Visa Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {VISA_CATEGORIES.map((visa) => (
                  <div
                    key={visa.code}
                    onClick={() => {
                      setSelectedVisaCode(visa.code);
                      handleTabChange('category', 'VIS-USR-010');
                    }}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-base font-extrabold text-blue-900">
                          {visa.code}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {visa.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                        {language === 'ko' ? visa.nameKo : visa.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {language === 'ko' ? visa.descriptionKo : visa.descriptionEn}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>{t.viewDetails}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Column: Latest Laws List & Legal Notice */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Regulations Column */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'ko' ? '최신 개정 고시 및 훈령 아카이브' : 'Recent Statutory Revisions'}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange('laws', 'VIS-USR-012')}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {language === 'ko' ? '전체보기 >' : 'View All >'}
                  </button>
                </div>

                <div className="space-y-3">
                  {LAW_ARCHIVE_DATA.map((law) => (
                    <div
                      key={law.id}
                      onClick={() => {
                        setSelectedLawId(law.id);
                        handleTabChange('laws', 'VIS-USR-013');
                      }}
                      className="p-3.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {law.category}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{law.promulgationDate}</span>
                          <span>·</span>
                          <span className="font-mono text-slate-400">{law.docNumber}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-700">
                          {language === 'ko' ? law.titleKo : law.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {language === 'ko' ? law.summaryKo : law.summaryEn}
                        </p>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {law.fileFormat} ({law.fileSize})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar: Official Forms & Advisory Notice */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'ko' ? '자주 찾는 출입국 서식' : 'Popular Application Forms'}
                    </h3>
                  </div>

                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer">
                      <span>[별지 34호] 통합신청서 (체류연장/변경)</span>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer">
                      <span>[서식] 외국인 고용사유서 및 활용계획서</span>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer">
                      <span>[서식] 신원보증서 (출입국 표준 양식)</span>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </li>
                  </ul>

                  <button
                    onClick={() => handleTabChange('forms', 'VIS-USR-040')}
                    className="w-full mt-2 py-2 text-xs font-semibold text-center text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {t.downloadForm}
                  </button>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>출입국 아카이빙 공지사항</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    본 플랫폼은 공익 목적의 법령 아카이빙 시스템으로, 일체의 유료 결제나 사증 대행 수수료를 수취하지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VISA CATEGORY GUIDE (VIS-USR-010) ================= */}
        {activeTab === 'category' && (
          <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    VIS-USR-010
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {language === 'ko' ? '체류자격별 요건 및 발급 절차 뷰어' : 'Visa Category Requirements & Flow'}
                  </h2>
                </div>

                {/* Visa Selector Segmented Control */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {VISA_CATEGORIES.map(v => (
                    <button
                      key={v.code}
                      onClick={() => setSelectedVisaCode(v.code)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                        selectedVisaCode === v.code
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {v.code} ({v.category})
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Visa Overview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xl font-black text-blue-900">{currentVisa.code}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {language === 'ko' ? currentVisa.nameKo : currentVisa.nameEn}
                  </span>
                  <span className="text-xs text-slate-500 font-mono ml-auto">
                    체류 기간: {currentVisa.stayPeriod}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ko' ? currentVisa.descriptionKo : currentVisa.descriptionEn}
                </p>
                <div className="mt-2 text-xs font-semibold text-slate-700">
                  <span className="text-slate-500">대상 인력: </span>
                  {language === 'ko' ? currentVisa.targetKo : currentVisa.targetEn}
                </div>
              </div>

              {/* 4-Step Process Flowchart */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  {language === 'ko' ? '사증 발급 및 체류 절차 (4-Step Flowchart)' : 'Application Procedure Roadmap'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(language === 'ko' ? currentVisa.processKo : currentVisa.processEn).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg relative flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-[11px] font-bold text-blue-700 block mb-1">
                          STAGE 0{idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          {step}
                        </p>
                      </div>
                      {idx < 3 && (
                        <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                {/* Requirements */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>{language === 'ko' ? '법적 핵심 요건 (Eligibility)' : 'Key Eligibility Criteria'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {(language === 'ko' ? currentVisa.keyRequirementsKo : currentVisa.keyRequirementsEn).map((req, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="font-bold text-blue-600">·</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ko' ? '필수 구비 서류 목록' : 'Required Supporting Documents'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {(language === 'ko' ? currentVisa.requiredDocsKo : currentVisa.requiredDocsEn).map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="font-bold text-emerald-600">✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LAWS & STATUTES ARCHIVE (VIS-USR-012 & 013) ================= */}
        {activeTab === 'laws' && (
          <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    VIS-USR-012 / VIS-USR-013
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {language === 'ko' ? '최신 법령·지침 아카이빙 CMS' : 'Immigration Law Archive & Directives'}
                  </h2>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  {['all', '시행규칙', '법무부지침', '체류관리고시'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setLawCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                        lawCategoryFilter === cat
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'all' ? (language === 'ko' ? '전체 보기' : 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Law Viewer: Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Law List Sidebar (5 cols) */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-xs text-slate-500 font-semibold mb-2">
                    검색 결과: <span className="text-blue-700 font-mono font-bold">{filteredLaws.length}</span> 건
                  </div>
                  {filteredLaws.map((law) => (
                    <div
                      key={law.id}
                      onClick={() => setSelectedLawId(law.id)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs ${
                        selectedLawId === law.id
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {law.category}
                        </span>
                        <span className="font-mono">{law.effectiveDate} 시행</span>
                      </div>
                      <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">
                        {language === 'ko' ? law.titleKo : law.titleEn}
                      </h4>
                      <p className="text-slate-500 line-clamp-1 mt-1">
                        {language === 'ko' ? law.summaryKo : law.summaryEn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Law Detail View & Downloader (7 cols) */}
                <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {currentLaw.docNumber}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {currentLaw.viewCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          {currentLaw.downloadCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-950 leading-snug">
                      {language === 'ko' ? currentLaw.titleKo : currentLaw.titleEn}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      공포일: {currentLaw.promulgationDate} | 시행일: {currentLaw.effectiveDate}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg text-xs leading-relaxed text-blue-950">
                    <span className="font-bold block mb-1">
                      {language === 'ko' ? '📌 개정 요지 및 핵심 포인트' : 'Key Reform Summary'}
                    </span>
                    {language === 'ko' ? currentLaw.summaryKo : currentLaw.summaryEn}
                  </div>

                  {/* Full Text Content */}
                  <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed font-sans max-h-60 overflow-y-auto">
                    <h5 className="font-bold text-slate-900 mb-2">
                      {language === 'ko' ? '조문 전문 (Statutory Text)' : 'Official Text'}
                    </h5>
                    <p className="whitespace-pre-line">
                      {language === 'ko' ? currentLaw.contentKo : currentLaw.contentEn}
                    </p>
                  </div>

                  {/* File Download Action Bar */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800">
                        원문_고시문_{currentLaw.docNumber.replace(/\s+/g, '_')}.{currentLaw.fileFormat.toLowerCase()}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({currentLaw.fileSize})
                      </span>
                    </div>

                    <button
                      onClick={() => alert(`[다운로드 시뮬레이션]\n${currentLaw.titleKo}\n파일: ${currentLaw.fileFormat} (${currentLaw.fileSize})`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadForm}</span>
                    </button>
                  </div>

                  {/* Social Comments & Feedback Section (VIS-USR-060) */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>의견 및 질의응답 (VIS-USR-060)</span>
                        <span className="text-slate-400 font-mono">({comments.filter(c => c.postId === selectedLawId && c.status === 'normal').length})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>SNS 공유</span>
                        </button>
                        {shareSuccess && (
                          <span className="text-[11px] text-emerald-600 font-medium animate-in fade-in">
                            링크가 복사되었습니다!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* New Comment Input */}
                    <form onSubmit={handleAddComment} className="space-y-2 mb-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={language === 'ko' ? '작성자 이름 / 닉네임' : 'Your Name'}
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          className="w-1/3 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder={language === 'ko' ? '본 법령에 대한 질문 또는 의견을 남겨주세요...' : 'Leave a question or note...'}
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                        >
                          등록
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {comments
                        .filter(c => c.postId === selectedLawId && c.status === 'normal')
                        .map(cmt => (
                          <div key={cmt.id} className="p-2.5 bg-white border border-slate-200 rounded text-xs">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                              <span className="font-semibold text-slate-700">{cmt.author}</span>
                              <span className="font-mono">{cmt.date}</span>
                            </div>
                            <p className="text-slate-700">{cmt.content}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: OFFICIAL FORMS ARCHIVE (VIS-USR-040) ================= */}
        {activeTab === 'forms' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                VIS-USR-040
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {language === 'ko' ? '출입국 공식 서식 및 신청서 자료실' : 'Official Immigration Application Forms'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ko'
                  ? '법무부 출입국·외국인정책본부 표준 법정 서식 및 주무부처 고용추천서 양식 원문 다운로드'
                  : 'Official statutory forms for visa applications, alien registration, and employer recommendations.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: '[별지 34호] 통합신청서', format: 'HWP / PDF', size: '240 KB', desc: '체류기간 연장, 체류자격 변경, 재입국허가 등 공통 신청서식' },
                { title: '[서식 12] 고용사유서 및 활용계획서', format: 'DOCX / HWP', size: '180 KB', desc: 'E-7 특정활동 전문인력 초청 시 필수 소명 사업계획서 양식' },
                { title: '[서식 07] 신원보증서 (공식 표준)', format: 'PDF / HWP', size: '120 KB', desc: '초청인 또는 고용기업 대표자 신원보증 각서' },
                { title: '[서식 21] 외국인투자기업 등록신청서', format: 'HWP / PDF', size: '310 KB', desc: 'D-8 기업투자 법인설립 및 외국환 자본금 증빙 양식' },
                { title: '[서식 09] 체류지 입증서류 확인서', format: 'HWP', size: '150 KB', desc: '임대차계약서 및 숙소제공확인서 표준 서식' },
                { title: '[점수표] F-2-7 점수제 배점표 워크시트', format: 'XLSX / PDF', size: '420 KB', desc: '우수인재 거주자격 연간 소득 및 학력 자가점검표' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                        {item.format}
                      </span>
                      <span className="font-mono">{item.size}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`[서식 다운로드 완료]\n${item.title}`)}
                    className="mt-4 w-full py-1.5 bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-400 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>서식 다운로드</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: ABOUT ORGANIZATION (VIS-USR-020) ================= */}
        {activeTab === 'about' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                VIS-USR-020
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {language === 'ko' ? '법률 조직 및 출입국 전문 자문단 소개' : 'Legal Advisory & Leadership Team'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                출입국 비자 행정, 노동·산재 보상, 외국인 정착 정책 연구를 주도하는 공인 전문가 그룹입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '정승훈 이사장', role: '재단법인 피플 이사장', desc: '이민·다문화 정책 거버넌스 총괄, 산재 예방 정책 협의체 위원' },
                { name: '김민우 대표노무사', role: '노무법인 한결 대표 / 산재 자문', desc: '외국인 근로자 권익 구제 및 업무상 재해 800여 건 성공적 승인' },
                { name: '박선영 대표행정사', role: '비자출입국행정사무소 대표', desc: '법무부 출입국민원 대행 실적 1,500건, E-7/D-8 전문 컨설팅' },
              ].map((member, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center mx-auto mb-3 text-lg">
                    {member.name.slice(0, 2)}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                  <span className="text-xs text-blue-700 font-semibold block mb-2">{member.role}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: MEDIA & PRESS (VIS-USR-050) ================= */}
        {activeTab === 'media' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                VIS-USR-050
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {language === 'ko' ? '언론 보도 및 영상 브리핑' : 'Press Releases & Video Briefings'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
                  <Video className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded">
                    12:40 | 고화질 브리핑 영상
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  [특집 브리핑] 2026 하반기 E-7-4 쿼터 확대 및 비자 행정 총정리
                </h4>
                <p className="text-xs text-slate-500">
                  법무부 숙련기능인력 제도 개편안에 따른 주요 유의사항 및 지자체 추천서 확보 전략.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
                  <Video className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded">
                    18:15 | 해설 세미나
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  [외국인정착설계사] 다문화 이주민 정착 지원과 민간 자격 제도의 비전
                </h4>
                <p className="text-xs text-slate-500">
                  국내 거주 외국인 260만 시대, 정착설계 전문가 양성의 필요성과 실무 로드맵.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Platform Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">{t.platformName}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.footerText}</p>
          </div>
          <div className="text-[11px] text-slate-500 text-right">
            <span>수행기관: (주)진세븐스타 | 수신: 재단법인 피플</span><br />
            <span>5개월 Fast-Track 조기 런칭 아키텍처 v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
