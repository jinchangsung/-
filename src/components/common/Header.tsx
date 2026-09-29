import React from 'react';
import { 
  PlatformType, 
  RoleType, 
  ViewMode, 
  DeviceType, 
  Language 
} from '../../types';
import { 
  Globe, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Layers, 
  Table, 
  FileText, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  platform: PlatformType;
  setPlatform: (p: PlatformType) => void;
  role: RoleType;
  setRole: (r: RoleType) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  device: DeviceType;
  setDevice: (d: DeviceType) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  isSpecOpen: boolean;
  setIsSpecOpen: (open: boolean) => void;
  activeScreenId: string;
}

export const Header: React.FC<HeaderProps> = ({
  platform,
  setPlatform,
  role,
  setRole,
  viewMode,
  setViewMode,
  device,
  setDevice,
  language,
  setLanguage,
  isSpecOpen,
  setIsSpecOpen,
  activeScreenId,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md select-none no-print">
      {/* Top Banner: Project Context & Metadata */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold tracking-wide">PROPOSAL & WIREFRAME SYSTEM</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">수행기관: (주)진세븐스타</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-200 font-semibold bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            수신: 재단법인 피플 귀하
          </span>
          <span className="text-slate-500 hidden md:inline">·</span>
          <span className="text-slate-400 hidden md:inline">5개월 Fast-Track 조기 런칭 맞춤형 아키텍처</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>현재 화면 ID:</span>
            <span className="font-mono bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded font-semibold">
              {activeScreenId}
            </span>
          </div>

          <button
            onClick={() => setIsSpecOpen(!isSpecOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              isSpecOpen
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
            title="기획 주석 및 상세 스펙 서랍 열기/닫기"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{isSpecOpen ? '기획 스펙 닫기' : '기획 스펙 보기'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Platform Selector */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setPlatform('visa')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                platform === 'visa'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>비자 정보 플랫폼</span>
              <span className="text-[10px] opacity-80">(아카이빙/다국어)</span>
            </button>
            <button
              onClick={() => setPlatform('edu')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                platform === 'edu'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>평생교육원 플랫폼</span>
              <span className="text-[10px] opacity-80">(접수·결제·수료)</span>
            </button>
          </div>

          {/* User vs Admin Role Toggle */}
          <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setRole('user')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                role === 'user'
                  ? 'bg-slate-200 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>사용자 페이지</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                role === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>관리자 전용 (Admin)</span>
            </button>
          </div>
        </div>

        {/* View Mode & Utility Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Tabs */}
          <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('wireframe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'wireframe'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>와이어프레임 뷰</span>
            </button>
            <button
              onClick={() => setViewMode('specs_table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'specs_table'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>기능 명세서 (IA/WBS)</span>
            </button>
            <button
              onClick={() => setViewMode('proposal_overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'proposal_overview'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>제안서 요약 & 범위</span>
            </button>
          </div>

          {/* Viewport Resizer (Only in Wireframe Mode) */}
          {viewMode === 'wireframe' && (
            <div className="hidden lg:flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setDevice('desktop')}
                title="데스크톱 뷰 (1440px)"
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                title="태블릿 뷰 (768px)"
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                title="모바일 뷰 (390px)"
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Language Switcher (Visa Platform) */}
          {platform === 'visa' && (
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setLanguage('ko')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  language === 'ko' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                KO
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
