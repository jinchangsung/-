import React from 'react';
import { DeviceType } from '../../types';

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, children }) => {
  if (device === 'desktop') {
    return <div className="w-full min-h-screen bg-slate-50">{children}</div>;
  }

  if (device === 'tablet') {
    return (
      <div className="min-h-screen bg-slate-800 p-4 sm:p-8 flex justify-center items-start">
        <div className="w-[768px] max-w-full bg-slate-50 rounded-2xl shadow-2xl border-[10px] border-slate-900 overflow-hidden min-h-[900px] flex flex-col">
          <div className="h-4 bg-slate-900 flex justify-center items-center">
            <div className="w-12 h-1 bg-slate-700 rounded-full" />
          </div>
          <div className="flex-1 overflow-x-hidden">{children}</div>
        </div>
      </div>
    );
  }

  // Mobile (390px)
  return (
    <div className="min-h-screen bg-slate-800 p-4 sm:p-8 flex justify-center items-start">
      <div className="w-[390px] max-w-full bg-slate-50 rounded-3xl shadow-2xl border-[10px] border-slate-900 overflow-hidden min-h-[800px] flex flex-col">
        {/* Dynamic Island / Notch */}
        <div className="h-6 bg-slate-900 flex justify-center items-center">
          <div className="w-24 h-3 bg-black rounded-full" />
        </div>
        <div className="flex-1 overflow-x-hidden">{children}</div>
        <div className="h-4 bg-slate-900 flex justify-center items-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
