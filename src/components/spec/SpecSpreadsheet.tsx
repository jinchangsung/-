import React, { useState } from 'react';
import { SCREEN_SPECS } from '../../data/specData';
import { ScreenSpec, PlatformType, RoleType } from '../../types';
import { 
  Search, 
  Download, 
  Filter, 
  ExternalLink, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface SpecSpreadsheetProps {
  onSelectScreenToWireframe: (screenId: string, platform: PlatformType, role: RoleType) => void;
}

export const SpecSpreadsheet: React.FC<SpecSpreadsheetProps> = ({
  onSelectScreenToWireframe,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | '비자' | '평생교육원' | '공통'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | '사용자' | '관리자' | '공통'>('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | '1차 개발' | '2차 이관'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecs = SCREEN_SPECS.filter(spec => {
    const matchesPlatform = platformFilter === 'all' || spec.platform === platformFilter;
    const matchesRole = roleFilter === 'all' || spec.role === roleFilter;
    const matchesPhase = phaseFilter === 'all' || spec.developmentPhase === phaseFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = query === '' ||
      spec.screenId.toLowerCase().includes(query) ||
      spec.depth1.toLowerCase().includes(query) ||
      spec.depth2.toLowerCase().includes(query) ||
      spec.description.toLowerCase().includes(query) ||
      spec.detailedProcess.toLowerCase().includes(query) ||
      spec.uiComponent.toLowerCase().includes(query);
    return matchesPlatform && matchesRole && matchesPhase && matchesQuery;
  });

  const exportToCSV = () => {
    const headers = ['No', '플랫폼', '구분', '1 Depth', '2 Depth', '3 Depth', '화면 ID', '화면 유형', '다국어', '권한', '기능명/설명', 'UI 컴포넌트', '상세 프로세스', '예외 처리', '우선순위', '개발 구분'];
    const rows = filteredSpecs.map(s => [
      s.no,
      s.platform,
      s.role,
      s.depth1,
      s.depth2,
      s.depth3 || '—',
      s.screenId,
      s.screenType,
      s.multilingual,
      s.permission,
      `"${s.description.replace(/"/g, '""')}"`,
      `"${s.uiComponent.replace(/"/g, '""')}"`,
      `"${s.detailedProcess.replace(/"/g, '""')}"`,
      `"${s.exceptionHandling.replace(/"/g, '""')}"`,
      s.priority,
      s.developmentPhase,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `2대플랫폼_기능명세서_WBS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (spec: ScreenSpec) => {
    const p: PlatformType = spec.platform === '비자' ? 'visa' : 'edu';
    const r: RoleType = spec.role === '관리자' ? 'admin' : 'user';
    onSelectScreenToWireframe(spec.screenId, p, r);
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 text-slate-800 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                2대 플랫폼 화면 설계 및 기능 명세서 (IA & SRS)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              제안서 첨부 스프레드시트 26개 화면 ID 전체 매핑 | 행 클릭 시 해당 와이어프레임 화면으로 즉시 이동
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV / 엑셀 다운로드</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Platform filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">플랫폼:</span>
              <select
                value={platformFilter}
                onChange={(e: any) => setPlatformFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800"
              >
                <option value="all">전체 플랫폼</option>
                <option value="비자">비자 정보 플랫폼</option>
                <option value="평생교육원">평생교육원 플랫폼</option>
              </select>
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">구분:</span>
              <select
                value={roleFilter}
                onChange={(e: any) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800"
              >
                <option value="all">전체 (사용자+관리자)</option>
                <option value="사용자">사용자 (User)</option>
                <option value="관리자">관리자 (Admin)</option>
              </select>
            </div>

            {/* Phase filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">개발 단계:</span>
              <select
                value={phaseFilter}
                onChange={(e: any) => setPhaseFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800"
              >
                <option value="all">전체 단계</option>
                <option value="1차 개발">1차 개발 (반영)</option>
                <option value="2차 이관">2차 이관 (LMS/접근성)</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="화면 ID, 기능명, 프로세스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#182747] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-center w-12">No</th>
                  <th className="py-2.5 px-3 font-semibold">플랫폼</th>
                  <th className="py-2.5 px-3 font-semibold">구분</th>
                  <th className="py-2.5 px-3 font-semibold">1 Depth</th>
                  <th className="py-2.5 px-3 font-semibold">2 Depth</th>
                  <th className="py-2.5 px-3 font-semibold">화면 ID</th>
                  <th className="py-2.5 px-3 font-semibold">화면 유형</th>
                  <th className="py-2.5 px-3 font-semibold">다국어</th>
                  <th className="py-2.5 px-3 font-semibold">기능명 및 상세 프로세스</th>
                  <th className="py-2.5 px-3 font-semibold">예외 처리</th>
                  <th className="py-2.5 px-3 font-semibold text-center">우선순위</th>
                  <th className="py-2.5 px-3 font-semibold text-center">개발구분</th>
                  <th className="py-2.5 px-3 font-semibold text-right">와이어프레임</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredSpecs.map((spec) => (
                  <tr
                    key={spec.screenId}
                    onClick={() => handleRowClick(spec)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{spec.no}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        spec.platform === '비자'
                          ? 'bg-blue-50 text-blue-700'
                          : spec.platform === '평생교육원'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {spec.platform}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{spec.role}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{spec.depth1}</td>
                    <td className="py-2.5 px-3 text-slate-700">{spec.depth2}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                      {spec.screenId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{spec.screenType}</td>
                    <td className="py-2.5 px-3 text-slate-600">{spec.multilingual}</td>
                    <td className="py-2.5 px-3 max-w-sm font-sans">
                      <strong className="block text-slate-900">{spec.description}</strong>
                      <span className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{spec.detailedProcess}</span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-slate-500 text-[11px] font-sans">
                      {spec.exceptionHandling}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        spec.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {spec.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        spec.developmentPhase === '1차 개발'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {spec.developmentPhase}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(spec);
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Layers className="w-3 h-3" />
                        <span>화면보기</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
