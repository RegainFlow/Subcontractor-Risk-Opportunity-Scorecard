import React from 'react';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { Vendor } from '../types';

interface DashboardProps {
  vendors: Vendor[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ vendors, onNavigate }) => {
  const avgScore = Math.round(vendors.reduce((acc, v) => acc + v.overallScore, 0) / vendors.length);
  const pendingCount = vendors.filter(v => v.status === 'Pending QA').length;
  const highRiskCount = vendors.filter(v => v.riskLevel === 'High' || v.riskLevel === 'Critical').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold font-primary mb-6">Executive Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverEffect={true} className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icons.Users size={64} />
          </div>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Total Vendors</p>
          <h2 className="text-4xl font-mono font-bold text-white mt-2">{vendors.length}</h2>
          <div className="mt-4 flex items-center text-green-400 text-xs gap-1">
            <Icons.TrendUp />
            <span>+12% from last month</span>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-yellow-400">
            <Icons.Shield size={64} />
          </div>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Avg. Risk Score</p>
          <h2 className="text-4xl font-mono font-bold text-white mt-2">{avgScore}</h2>
          <div className="mt-4 flex items-center text-text-secondary text-xs gap-1">
            <span>Stable metric</span>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="relative overflow-hidden group" onClick={() => onNavigate('qa')}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
            <Icons.HardHat size={64} />
          </div>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">Pending Approval</p>
          <h2 className="text-4xl font-mono font-bold text-white mt-2">{pendingCount}</h2>
          <div className="mt-4 flex items-center text-yellow-400 text-xs gap-1">
            <Icons.Warning />
            <span>Requires Action</span>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="relative overflow-hidden group" onClick={() => onNavigate('analytics')}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
            <Icons.Warning size={64} />
          </div>
          <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">High Risk Vendors</p>
          <h2 className="text-4xl font-mono font-bold text-red-400 mt-2">{highRiskCount}</h2>
          <div className="mt-4 flex items-center text-red-400/80 text-xs gap-1">
            <span>Needs Mitigation</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Pending QA Reviews</h3>
            <button onClick={() => onNavigate('qa')} className="text-xs text-primary hover:text-primary-light transition-colors uppercase font-bold tracking-wider">View All</button>
          </div>
          <div className="space-y-4">
            {vendors.filter(v => v.status === 'Pending QA').slice(0, 3).map((vendor, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                  <Icons.HardHat size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{vendor.name}</h4>
                  <p className="text-xs text-text-secondary">{vendor.type}</p>
                </div>
                <button onClick={() => onNavigate('qa')} className="text-xs bg-primary-alpha15 text-primary px-3 py-1 rounded border border-primary-alpha25 hover:bg-primary-alpha25 transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">System Notifications</h3>
            <button className="text-xs text-text-secondary hover:text-white transition-colors">Clear All</button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="mt-1 min-w-[8px] h-2 rounded-full bg-primary shadow-[0_0_8px_#00d6cb]"></div>
              <div>
                <p className="text-sm text-white">New compliance standard (ISO 45001) added to QA checklist.</p>
                <p className="text-xs text-text-secondary mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-1 min-w-[8px] h-2 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm text-white">Safety incident reported for "SteelWorks Inc".</p>
                <p className="text-xs text-text-secondary mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-1 min-w-[8px] h-2 rounded-full bg-gray-600"></div>
              <div>
                <p className="text-sm text-white">Weekly risk report generated successfully.</p>
                <p className="text-xs text-text-secondary mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};