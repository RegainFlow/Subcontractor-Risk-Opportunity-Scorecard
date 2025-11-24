import React from 'react';
import { Vendor, VendorStatus } from '../types';
import { GlassCard } from './GlassCard';
import { RiskBadge } from './RiskBadge';
import { Icons } from './Icons';

interface VendorListProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  onAddVendor: () => void;
}

export const VendorList: React.FC<VendorListProps> = ({ vendors, onSelectVendor, onAddVendor }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-primary">Active Subcontractors</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vendors..."
              className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder-text-secondary"
            />
            <Icons.Search className="absolute left-3 top-2.5 text-text-secondary" size={16} />
          </div>
          <button
            onClick={onAddVendor}
            className="bg-primary-alpha15 text-primary border border-primary hover:bg-primary-alpha25 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-glow-subtle flex items-center gap-2"
          >
            <span>+ New Vendor</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hidden md:grid">
          <div className="col-span-4">Vendor</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Risk</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {vendors.map((vendor) => (
          <GlassCard
            key={vendor.id}
            hoverEffect={true}
            onClick={() => onSelectVendor(vendor)}
            className="group cursor-pointer border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Vendor Info */}
              <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors border border-white/5 group-hover:border-primary/20">
                  <Icons.Building size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{vendor.name}</h3>
                  <p className="text-xs text-text-secondary font-mono">{vendor.type}</p>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-1 md:col-span-2 flex md:justify-center">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${vendor.status === VendorStatus.APPROVED ? 'bg-green-500/10 text-green-400' :
                    vendor.status === VendorStatus.REJECTED ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                  {vendor.status}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-1 md:col-span-2 flex md:justify-center">
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-mono font-bold ${vendor.overallScore >= 80 ? 'text-primary' : vendor.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {vendor.overallScore}
                  </span>
                  <span className="text-xs text-text-secondary">/100</span>
                </div>
              </div>

              {/* Risk */}
              <div className="col-span-1 md:col-span-2 flex md:justify-center">
                <div className="scale-90">
                  <RiskBadge level={vendor.riskLevel} />
                </div>
              </div>

              {/* Action */}
              <div className="col-span-1 md:col-span-2 flex justify-end text-text-secondary group-hover:text-white transition-colors">
                <Icons.ArrowRight size={20} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};