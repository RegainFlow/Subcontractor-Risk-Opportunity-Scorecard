import React from 'react';
import { Vendor, VendorStatus } from '../types';
import { GlassCard } from './GlassCard';
import { RiskBadge } from './RiskBadge';
import { Icons } from './Icons';

interface QAApprovalsProps {
    vendors: Vendor[];
    onUpdateVendor: (vendor: Vendor) => void;
}

export const QAApprovals: React.FC<QAApprovalsProps> = ({ vendors, onUpdateVendor }) => {
    const pendingVendors = vendors.filter(v => v.status === VendorStatus.PENDING);

    const handleApprove = (vendor: Vendor) => {
        onUpdateVendor({ ...vendor, status: VendorStatus.APPROVED });
    };

    const handleReject = (vendor: Vendor) => {
        onUpdateVendor({ ...vendor, status: VendorStatus.REJECTED });
    };

    return (
        <div className="animate-fade-in space-y-6 pb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-primary text-white">QA Approvals</h1>
                    <p className="text-text-secondary mt-1">Review and approve pending vendor applications.</p>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-text-secondary text-sm">Pending Review: </span>
                    <span className="text-white font-bold ml-2">{pendingVendors.length}</span>
                </div>
            </div>

            {pendingVendors.length === 0 ? (
                <GlassCard className="text-center py-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                        <Icons.Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                    <p className="text-text-secondary">There are no pending vendors to review at this time.</p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {/* List Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hidden md:grid">
                        <div className="col-span-4">Vendor</div>
                        <div className="col-span-2 text-center">Risk</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {pendingVendors.map(vendor => (
                        <GlassCard key={vendor.id} className="group hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                {/* Vendor Info */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-white transition-colors">
                                        <Icons.Building size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{vendor.name}</h3>
                                        <span className="text-xs font-mono text-text-secondary bg-black/30 px-1.5 py-0.5 rounded">
                                            {vendor.id}
                                        </span>
                                    </div>
                                </div>

                                {/* Risk Badge */}
                                <div className="col-span-1 md:col-span-2 flex md:justify-center">
                                    <div className="scale-90">
                                        <RiskBadge level={vendor.riskLevel} />
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="col-span-1 md:col-span-2 flex md:justify-center">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-mono font-bold text-white">{vendor.overallScore}</span>
                                        <span className="text-xs text-text-secondary">/100</span>
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="col-span-1 md:col-span-2">
                                    <span className="text-sm text-text-secondary">{vendor.type}</span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleReject(vendor)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                                        title="Reject"
                                    >
                                        <Icons.Reject size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(vendor)}
                                        className="p-2 rounded-lg hover:bg-green-500/20 text-text-secondary hover:text-green-400 transition-colors"
                                        title="Approve"
                                    >
                                        <Icons.Check size={20} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
};
