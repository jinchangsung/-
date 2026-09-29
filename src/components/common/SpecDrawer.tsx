import React from 'react';
import { SCREEN_SPECS } from '../../data/specData';
import { ScreenSpec } from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ExternalLink, 
  ListFilter,
  ArrowRight
} from 'lucide-react';

interface SpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
}

export const SpecDrawer: React.FC<SpecDrawerProps> = ({
  isOpen,
  onClose,
  activeScreenId,
  onSelectScreen,
}) => {
  const currentSpec = SCREEN_SPECS.find(s => s.screenId === activeScreenId) || SCREEN_SPECS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col no-print">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">기획서 화면 기능 명세 (SRS & Spec)</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Screen Quick Selector */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
          화면 빠른 이동 (총 {SCREEN_SPECS.length}개 화면 ID)
        </label>
        <select
          value={activeScreenId}
          onChange={(e) => onSelectScreen(e.target.value)}
          className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {SCREEN_SPECS.map(spec => (
            <option key={spec.screenId} value={spec.screenId}>
              [{spec.platform} - {spec.role}] {spec.screenId} | {spec.depth1} &gt; {spec.depth2}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
        {/* Screen Identity Block */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-base font-bold text-blue-900 tracking-tight">
              {currentSpec.screenId}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                currentSpec.developmentPhase === '1차 개발'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentSpec.developmentPhase}
              </span>
              <span className="text-[11px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                우선순위: {currentSpec.priority}
              </span>
            </div>
          </div>

          <h4 className="text-base font-bold text-slate-900 mb-1">
            {currentSpec.depth1} &gt; {currentSpec.depth2} {currentSpec.depth3 !== '—' && `> ${currentSpec.depth3}`}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentSpec.description}
          </p>
        </div>

        {/* Technical Attributes Table */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-blue-600" />
            화면 설계 속성 (Attributes)
          </h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">소속 플랫폼</span>
              <span className="font-semibold text-slate-800">{currentSpec.platform} 플랫폼</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">사용자 권한</span>
              <span className="font-semibold text-slate-800">{currentSpec.role} ({currentSpec.permission})</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">화면 유형</span>
              <span className="font-mono font-medium text-slate-800">{currentSpec.screenType}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">다국어 적용 여부</span>
              <span className="font-semibold text-slate-800">{currentSpec.multilingual}</span>
            </div>
          </div>
        </div>

        {/* UI Component Specifications */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            적용 UI 컴포넌트
          </h5>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs text-slate-800 font-medium">
            {currentSpec.uiComponent}
          </div>
        </div>

        {/* Detailed Business Process */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            상세 비즈니스 프로세스 (Process Flow)
          </h5>
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded text-xs text-slate-700 leading-relaxed">
            {currentSpec.detailedProcess}
          </div>
        </div>

        {/* Exception Handling & Validation Rules */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            예외 처리 및 유효성 검증 규칙 (Exception Handling)
          </h5>
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-xs text-slate-700 leading-relaxed">
            {currentSpec.exceptionHandling}
          </div>
        </div>

        {/* Next Step / Development Notes */}
        <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
          <span className="font-semibold text-slate-800 block">💡 기획자 코멘트 (Review Note):</span>
          <p>
            고객사(재단법인 피플) 보고용 와이어프레임으로, 좌측 인터랙티브 화면에서 버튼 클릭, 탭 전환, 결제 팝업 호출, 수료증 인쇄 등을 직접 테스트하실 수 있습니다.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>기획 문서 버전 v1.0</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-slate-800 text-white rounded font-medium hover:bg-slate-700 transition-colors"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
