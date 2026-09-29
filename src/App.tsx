/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlatformType, RoleType, ViewMode, DeviceType, Language } from './types';
import { Header } from './components/common/Header';
import { SpecDrawer } from './components/common/SpecDrawer';
import { DeviceFrame } from './components/common/DeviceFrame';
import { VisaUserPortal } from './components/visa/VisaUserPortal';
import { VisaAdminPortal } from './components/visa/VisaAdminPortal';
import { EduUserPortal } from './components/edu/EduUserPortal';
import { EduAdminPortal } from './components/edu/EduAdminPortal';
import { ProposalOverview } from './components/proposal/ProposalOverview';
import { SpecSpreadsheet } from './components/spec/SpecSpreadsheet';

export default function App() {
  const [platform, setPlatform] = useState<PlatformType>('visa');
  const [role, setRole] = useState<RoleType>('user');
  const [viewMode, setViewMode] = useState<ViewMode>('wireframe');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [language, setLanguage] = useState<Language>('ko');
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [activeScreenId, setActiveScreenId] = useState<string>('VIS-USR-001');

  // Handle platform change
  const handlePlatformChange = (p: PlatformType) => {
    setPlatform(p);
    if (p === 'visa') {
      setActiveScreenId(role === 'user' ? 'VIS-USR-001' : 'VIS-ADM-010');
    } else {
      setActiveScreenId(role === 'user' ? 'EDU-USR-001' : 'EDU-ADM-001');
    }
  };

  // Handle role change
  const handleRoleChange = (r: RoleType) => {
    setRole(r);
    if (platform === 'visa') {
      setActiveScreenId(r === 'user' ? 'VIS-USR-001' : 'VIS-ADM-010');
    } else {
      setActiveScreenId(r === 'user' ? 'EDU-USR-001' : 'EDU-ADM-001');
    }
  };

  // Screen selection from spec drawer or spreadsheet
  const handleSelectScreen = (screenId: string, targetPlatform?: PlatformType, targetRole?: RoleType) => {
    setActiveScreenId(screenId);
    if (targetPlatform) setPlatform(targetPlatform);
    else if (screenId.startsWith('VIS')) setPlatform('visa');
    else if (screenId.startsWith('EDU')) setPlatform('edu');

    if (targetRole) setRole(targetRole);
    else if (screenId.includes('ADM')) setRole('admin');
    else if (screenId.includes('USR')) setRole('user');

    setViewMode('wireframe');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        platform={platform}
        setPlatform={handlePlatformChange}
        role={role}
        setRole={handleRoleChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        device={device}
        setDevice={setDevice}
        language={language}
        setLanguage={setLanguage}
        isSpecOpen={isSpecOpen}
        setIsSpecOpen={setIsSpecOpen}
        activeScreenId={activeScreenId}
      />

      {/* Main View Switcher */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'proposal_overview' && (
          <ProposalOverview
            onNavigateToWireframe={(p, r) => {
              setPlatform(p);
              setRole(r);
              setActiveScreenId(p === 'visa' ? (r === 'user' ? 'VIS-USR-001' : 'VIS-ADM-010') : (r === 'user' ? 'EDU-USR-001' : 'EDU-ADM-001'));
              setViewMode('wireframe');
            }}
            onNavigateToSpecs={() => setViewMode('specs_table')}
          />
        )}

        {viewMode === 'specs_table' && (
          <SpecSpreadsheet
            onSelectScreenToWireframe={(screenId, p, r) => {
              handleSelectScreen(screenId, p, r);
            }}
          />
        )}

        {viewMode === 'wireframe' && (
          <DeviceFrame device={device}>
            {platform === 'visa' && role === 'user' && (
              <VisaUserPortal
                language={language}
                onScreenChange={(screenId) => setActiveScreenId(screenId)}
                activeScreenId={activeScreenId}
              />
            )}

            {platform === 'visa' && role === 'admin' && (
              <VisaAdminPortal
                onScreenChange={(screenId) => setActiveScreenId(screenId)}
                activeScreenId={activeScreenId}
              />
            )}

            {platform === 'edu' && role === 'user' && (
              <EduUserPortal
                onScreenChange={(screenId) => setActiveScreenId(screenId)}
                activeScreenId={activeScreenId}
              />
            )}

            {platform === 'edu' && role === 'admin' && (
              <EduAdminPortal
                onScreenChange={(screenId) => setActiveScreenId(screenId)}
                activeScreenId={activeScreenId}
              />
            )}
          </DeviceFrame>
        )}
      </div>

      {/* Right Drawer: SRS & Screen Spec Inspector */}
      <SpecDrawer
        isOpen={isSpecOpen}
        onClose={() => setIsSpecOpen(false)}
        activeScreenId={activeScreenId}
        onSelectScreen={(screenId) => handleSelectScreen(screenId)}
      />
    </div>
  );
}
