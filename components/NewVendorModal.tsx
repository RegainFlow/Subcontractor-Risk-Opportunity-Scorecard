import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { Vendor, VendorStatus, RiskLevel } from '../types';

interface NewVendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vendor: Vendor) => void;
}

export const NewVendorModal: React.FC<NewVendorModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('General Contractor');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newVendor: Vendor = {
            id: `V-${Math.floor(Math.random() * 10000)}`,
            name,
            type,
            description,
            status: VendorStatus.PENDING,
            riskLevel: RiskLevel.MEDIUM, // Default initial risk
            overallScore: 0, // Initial score
            metrics: {
                financialHealth: 0,
                safetyRecord: 0,
                projectPerformance: 0,
                compliance: 0
            },
            lastAuditDate: new Date().toISOString().split('T')[0]
        };

        onSave(newVendor);
        onClose();
        // Reset form
        setName('');
        setType('General Contractor');
        setDescription('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <GlassCard className="w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                >
                    <Icons.Reject size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Add New Vendor</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-text-secondary mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. Acme Construction"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-text-secondary mb-1">Trade Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="General Contractor">General Contractor</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="HVAC">HVAC</option>
                            <option value="Concrete">Concrete</option>
                            <option value="Steel">Steel</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-text-secondary mb-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                            placeholder="Brief description of services and history..."
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-text-secondary hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary-dark transition-colors"
                        >
                            Add Vendor
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
