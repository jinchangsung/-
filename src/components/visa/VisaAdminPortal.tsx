import React, { useState } from 'react';
import { LawArchiveItem, CommentItem } from '../../types';
import { LAW_ARCHIVE_DATA, INITIAL_COMMENTS } from '../../data/mockData';
import { 
  FileEdit, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  Globe, 
  ShieldAlert, 
  Flag, 
  Ban, 
  Search, 
  Save, 
  UploadCloud, 
  Tag, 
  Layers,
  Calendar
} from 'lucide-react';

interface VisaAdminPortalProps {
  onScreenChange: (screenId: string) => void;
  activeScreenId: string;
}

export const VisaAdminPortal: React.FC<VisaAdminPortalProps> = ({
  onScreenChange,
  activeScreenId,
}) => {
  const [adminSection, setAdminSection] = useState<'content' | 'moderation'>('content');
  const [laws, setLaws] = useState<LawArchiveItem[]>(LAW_ARCHIVE_DATA);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [selectedLawForEdit, setSelectedLawForEdit] = useState<LawArchiveItem | null>(null);

  // Editor Form States
  const [editorLangTab, setEditorLangTab] = useState<'ko' | 'en'>('ko');
  const [formTitleKo, setFormTitleKo] = useState('출입국관리법 시행령 제23조 개정 고시 (E-7-4 쿼터 확대)');
  const [formTitleEn, setFormTitleEn] = useState('Immigration Control Act Article 23 Revision (E-7-4 Quota Expansion)');
  const [formCategory, setFormCategory] = useState<'출입국관리법' | '시행규칙' | '법무부지침' | '외국인고용법' | '체류관리고시'>('시행규칙');
  const [formDocNumber, setFormDocNumber] = useState('법무부고시 제2026-150호');
  const [formEffectiveDate, setFormEffectiveDate] = useState('2026-10-15');
  const [formSummaryKo, setFormSummaryKo] = useState('뿌리산업 및 지자체 추천제 확대를 반영한 개정 고시');
  const [formSummaryEn, setFormSummaryEn] = useState('Skilled worker quota expansion and provincial recommendation policy');
  const [formPublishType, setFormPublishType] = useState<'immediate' | 'scheduled'>('immediate');
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const handleOpenEditor = (law?: LawArchiveItem) => {
    if (law) {
      setSelectedLawForEdit(law);
      setFormTitleKo(law.titleKo);
      setFormTitleEn(law.titleEn);
      setFormCategory(law.category);
      setFormDocNumber(law.docNumber);
      setFormEffectiveDate(law.effectiveDate);
      setFormSummaryKo(law.summaryKo);
      setFormSummaryEn(law.summaryEn);
    } else {
      setSelectedLawForEdit(null);
      setFormTitleKo('');
      setFormTitleEn('');
      setFormDocNumber('법무부고시 제2026-NEW호');
      setFormEffectiveDate(new Date().toISOString().slice(0, 10));
      setFormSummaryKo('');
      setFormSummaryEn('');
    }
    setAdminSection('content');
    onScreenChange('VIS-ADM-010');
  };

  const handleSaveLaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleKo) {
      alert('국문 제목은 필수 입력 항목입니다.');
      return;
    }

    if (selectedLawForEdit) {
      setLaws(laws.map(l => l.id === selectedLawForEdit.id ? {
        ...l,
        titleKo: formTitleKo,
        titleEn: formTitleEn || formTitleKo,
        category: formCategory,
        docNumber: formDocNumber,
        effectiveDate: formEffectiveDate,
        summaryKo: formSummaryKo,
        summaryEn: formSummaryEn || formSummaryKo,
      } : l));
      setSaveAlert('법령 콘텐츠가 성공적으로 수정되었습니다 (국/영문 매핑 완료).');
    } else {
      const newLaw: LawArchiveItem = {
        id: 'LAW-' + Date.now(),
        titleKo: formTitleKo,
        titleEn: formTitleEn || formTitleKo,
        category: formCategory,
        promulgationDate: new Date().toISOString().slice(0, 10),
        effectiveDate: formEffectiveDate,
        docNumber: formDocNumber,
        summaryKo: formSummaryKo,
        summaryEn: formSummaryEn || formSummaryKo,
        contentKo: formSummaryKo,
        contentEn: formSummaryEn,
        fileFormat: 'PDF',
        fileSize: '1.2 MB',
        viewCount: 0,
        downloadCount: 0,
        status: formPublishType === 'scheduled' ? 'scheduled' : 'published',
      };
      setLaws([newLaw, ...laws]);
      setSaveAlert('신규 법령 아카이브가 성공적으로 발행되었습니다.');
    }

    setTimeout(() => setSaveAlert(null), 3000);
  };

  const toggleBlindComment = (id: string) => {
    setComments(comments.map(c => c.id === id ? {
      ...c,
      status: c.status === 'normal' ? 'blinded' : 'normal',
    } : c));
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Navigation & Status Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  VISA PLATFORM ADMIN CMS
                </span>
                <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  {activeScreenId}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                출입국·비자 법령 아카이빙 관리자 시스템
              </h2>
            </div>
          </div>

          {/* Section Selector */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => {
                setAdminSection('content');
                onScreenChange('VIS-ADM-010');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                adminSection === 'content'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>법령/뉴스 CMS 관리 (VIS-ADM-010)</span>
            </button>
            <button
              onClick={() => {
                setAdminSection('moderation');
                onScreenChange('VIS-ADM-040');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                adminSection === 'moderation'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>소셜 댓글/신고 관리 (VIS-ADM-040)</span>
            </button>
          </div>
        </div>

        {saveAlert && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveAlert}</span>
          </div>
        )}

        {/* ================= SECTION 1: CONTENT CMS (VIS-ADM-010) ================= */}
        {adminSection === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Law Records List (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">등록 법령 목록 ({laws.length}건)</span>
                <button
                  onClick={() => handleOpenEditor()}
                  className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 법령 등록</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto">
                {laws.map(law => (
                  <div
                    key={law.id}
                    onClick={() => handleOpenEditor(law)}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition-all ${
                      selectedLawForEdit?.id === law.id
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {law.category}
                      </span>
                      <span className="font-mono">{law.effectiveDate}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 line-clamp-2">{law.titleKo}</h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="font-mono">{law.docNumber}</span>
                      <span className={`px-1.5 py-0.2 rounded font-medium ${
                        law.status === 'published' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                      }`}>
                        {law.status === 'published' ? '발행완료' : '예약발행'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: WYSIWYG & Bilingual Form (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <form onSubmit={handleSaveLaw} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      VIS-ADM-010
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedLawForEdit ? '법령·지침 아카이브 수정' : '신규 법령·지침 등록'}
                    </h3>
                  </div>

                  {/* Dual Language Mapping Tabs */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditorLangTab('ko')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                        editorLangTab === 'ko' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>국문 원본 (KO)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorLangTab('en')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                        editorLangTab === 'en' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>영문 매핑 (EN)</span>
                    </button>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">법령 카테고리</label>
                    <select
                      value={formCategory}
                      onChange={(e: any) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                    >
                      <option value="출입국관리법">출입국관리법</option>
                      <option value="시행규칙">시행규칙</option>
                      <option value="법무부지침">법무부지침</option>
                      <option value="체류관리고시">체류관리고시</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">고시/공고 번호</label>
                    <input
                      type="text"
                      value={formDocNumber}
                      onChange={(e) => setFormDocNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">시행 일자</label>
                    <input
                      type="date"
                      value={formEffectiveDate}
                      onChange={(e) => setFormEffectiveDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                {/* Language Dependent Content Fields */}
                {editorLangTab === 'ko' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        법령/고시명 (국문 필수)
                      </label>
                      <input
                        type="text"
                        value={formTitleKo}
                        onChange={(e) => setFormTitleKo(e.target.value)}
                        placeholder="예: 출입국관리법 시행규칙 제23조 개정 고시"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        개정 요지 및 핵심 포인트 요약 (국문)
                      </label>
                      <textarea
                        rows={3}
                        value={formSummaryKo}
                        onChange={(e) => setFormSummaryKo(e.target.value)}
                        placeholder="메인 롤링 배너 및 상세 상단에 노출될 요약문..."
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Title in English (영문 매핑)
                      </label>
                      <input
                        type="text"
                        value={formTitleEn}
                        onChange={(e) => setFormTitleEn(e.target.value)}
                        placeholder="e.g. Immigration Control Act Article 23 Revision"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Executive Summary in English (영문 요약)
                      </label>
                      <textarea
                        rows={3}
                        value={formSummaryEn}
                        onChange={(e) => setFormSummaryEn(e.target.value)}
                        placeholder="English summary displayed when foreign visitors toggle EN mode..."
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* File Attachment & Tag Manager */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>원문 PDF/HWP 서식 매핑</span>
                    </label>
                    <span className="text-[11px] text-slate-500 block mb-2">
                      신구조문대비표 또는 공식 고시문 파일 첨부
                    </span>
                    <input
                      type="file"
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>체류자격 연계 태그</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {['E-7 특정활동', 'E-7-4', 'D-8 기업투자', 'D-2 유학', 'F-2 거주'].map(tag => (
                        <span key={tag} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                          +{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Publish Options & Actions */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1 text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="publishType"
                        checked={formPublishType === 'immediate'}
                        onChange={() => setFormPublishType('immediate')}
                        className="text-blue-600"
                      />
                      <span>즉시 발행</span>
                    </label>
                    <label className="flex items-center gap-1 text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="publishType"
                        checked={formPublishType === 'scheduled'}
                        onChange={() => setFormPublishType('scheduled')}
                        className="text-blue-600"
                      />
                      <span>예약 발행</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>법령 아카이브 저장 & 발행</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: COMMENT MODERATION (VIS-ADM-040) ================= */}
        {adminSection === 'moderation' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  VIS-ADM-040
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  소셜 댓글 및 사용자 의견 모니터링 관리
                </h3>
              </div>
              <div className="text-xs text-slate-500">
                악성 도배 자동 방지 / 신고 누적 건 우선 검토
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">연결 법령</th>
                    <th className="py-2.5 px-3">작성자</th>
                    <th className="py-2.5 px-3">댓글 내용</th>
                    <th className="py-2.5 px-3">작성 일시</th>
                    <th className="py-2.5 px-3 text-center">신고 건수</th>
                    <th className="py-2.5 px-3 text-center">노출 상태</th>
                    <th className="py-2.5 px-3 text-right">조치 (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  {comments.map((cmt) => (
                    <tr key={cmt.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{cmt.postId}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{cmt.author}</td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-slate-700">{cmt.content}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{cmt.date}</td>
                      <td className="py-2.5 px-3 text-center">
                        {cmt.reportCount > 0 ? (
                          <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {cmt.reportCount}회 신고
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-medium ${
                          cmt.status === 'normal'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {cmt.status === 'normal' ? '정상 노출' : '블라인드'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => toggleBlindComment(cmt.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            cmt.status === 'normal'
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          }`}
                        >
                          {cmt.status === 'normal' ? '블라인드 처리' : '노출 복구'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
