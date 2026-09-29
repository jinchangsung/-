import React from 'react';
import { PROPOSAL_META, SCOPE_MATRIX } from '../../data/specData';
import { Globe, GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, FileSpreadsheet, Layers } from 'lucide-react';
import { PlatformType, RoleType, ViewMode } from '../../types';

interface ProposalOverviewProps {
  onNavigateToWireframe: (platform: PlatformType, role: RoleType) => void;
  onNavigateToSpecs: () => void;
}

export const ProposalOverview: React.FC<ProposalOverviewProps> = ({
  onNavigateToWireframe,
  onNavigateToSpecs,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ================= SLIDE 1: COVER & DUAL STRATEGY ================= */}
        <section className="bg-[#152238] rounded-2xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          {/* Subtle golden ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Kicker */}
          <span className="text-amber-400 font-mono text-xs font-bold tracking-widest uppercase block mb-3">
            PROPOSAL FOR DIGITAL PLATFORMS
          </span>

          {/* Main Title & Subtitle */}
          <div className="mb-10 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              {PROPOSAL_META.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              {PROPOSAL_META.subtitle}
            </p>
          </div>

          {/* Dual Platform Strategic Cards (Golden/White accent border) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Visa Platform Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-7 border-2 border-amber-300/80 shadow-lg flex flex-col justify-between relative group hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-bold text-slate-950">
                    {PROPOSAL_META.platforms.visa.name}
                  </h3>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">핵심 목적: </strong>
                      {PROPOSAL_META.platforms.visa.coreGoal}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">구축 전략: </strong>
                      {PROPOSAL_META.platforms.visa.strategy}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">운영 특성: </strong>
                      {PROPOSAL_META.platforms.visa.characteristics}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">관리 체계: </strong>
                      {PROPOSAL_META.platforms.visa.adminSystem}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToWireframe('visa', 'user')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>비자 사용자 와이어프레임</span>
                </button>
                <button
                  onClick={() => onNavigateToWireframe('visa', 'admin')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  <span>관리자 CMS</span>
                </button>
              </div>
            </div>

            {/* Lifelong Education Platform Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-7 border-2 border-amber-300/80 shadow-lg flex flex-col justify-between relative group hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-slate-950">
                    {PROPOSAL_META.platforms.edu.name}
                  </h3>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">핵심 목적: </strong>
                      {PROPOSAL_META.platforms.edu.coreGoal}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">구축 전략: </strong>
                      {PROPOSAL_META.platforms.edu.strategy}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">수료 관리: </strong>
                      {PROPOSAL_META.platforms.edu.certification}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">단계별 접근: </strong>
                      {PROPOSAL_META.platforms.edu.phasedApproach}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToWireframe('edu', 'user')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>교육원 사용자 와이어프레임</span>
                </button>
                <button
                  onClick={() => onNavigateToWireframe('edu', 'admin')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  <span>교육원 관리자</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slide 1 Footer Metas */}
          <div className="pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span>수행기관: <strong className="text-slate-200">{PROPOSAL_META.contractor}</strong></span>
              <span className="mx-2">|</span>
              <span>제출일자: {PROPOSAL_META.submissionDate}</span>
              <span className="mx-2">|</span>
              <span>수신: <strong className="text-amber-400">{PROPOSAL_META.client}</strong></span>
            </div>
            <button
              onClick={onNavigateToSpecs}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
            >
              <span>전체 기능명세(WBS) 시트 열기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* ================= SLIDE 2: SCOPE & FEATURES MATRIX ================= */}
        <section className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          <div>
            <span className="text-amber-600 font-mono text-xs font-bold tracking-widest uppercase block mb-1">
              01. SCOPE & FEATURES
            </span>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              플랫폼별 개발 기능 구현 범위 (공통 / 반영 / 2차 이관)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              5개월 개발 일정 준수 및 운영 효율 극대화를 위한 플랫폼별 기능 분기 매트릭스
            </p>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-300">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#182747] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold w-1/6">구분</th>
                  <th className="py-3 px-4 font-bold w-2/6">공통 구현 사항 (두 플랫폼 동일)</th>
                  <th className="py-3 px-4 font-bold w-1.5/6 text-blue-200">비자 정보 플랫폼</th>
                  <th className="py-3 px-4 font-bold w-1.5/6 text-emerald-200">평생교육원 플랫폼</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {SCOPE_MATRIX.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      {row.category}
                    </td>
                    <td className="py-3.5 px-4 leading-relaxed text-slate-700">
                      {row.common}
                    </td>
                    <td className="py-3.5 px-4 leading-relaxed font-medium">
                      <span className={row.visa.includes('[반영]') ? 'text-blue-700 font-bold' : row.visa.includes('2차') ? 'text-amber-700' : 'text-slate-600'}>
                        {row.visa}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 leading-relaxed font-medium">
                      <span className={row.edu.includes('[반영]') ? 'text-emerald-700 font-bold' : row.edu.includes('2차') ? 'text-amber-700' : 'text-slate-600'}>
                        {row.edu}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
