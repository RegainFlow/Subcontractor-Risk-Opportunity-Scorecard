import React from 'react';
import { Vendor, RiskLevel } from '../types';
import { GlassCard } from './GlassCard';
import { RiskBadge } from './RiskBadge';
import { Icons } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface RiskAnalyticsProps {
    vendors: Vendor[];
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ vendors }) => {
    // Calculate Risk Distribution
    const riskCounts = vendors.reduce((acc, vendor) => {
        acc[vendor.riskLevel] = (acc[vendor.riskLevel] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = [
        { name: 'Low', value: riskCounts[RiskLevel.LOW] || 0, color: '#10b981' },
        { name: 'Medium', value: riskCounts[RiskLevel.MEDIUM] || 0, color: '#f59e0b' },
        { name: 'High', value: riskCounts[RiskLevel.HIGH] || 0, color: '#ef4444' },
        { name: 'Critical', value: riskCounts[RiskLevel.CRITICAL] || 0, color: '#7f1d1d' },
    ].filter(d => d.value > 0);

    // Calculate Average Metrics
    const avgMetrics = vendors.reduce((acc, vendor) => {
        acc.financial += vendor.metrics.financialHealth;
        acc.safety += vendor.metrics.safetyRecord;
        acc.performance += vendor.metrics.projectPerformance;
        acc.compliance += vendor.metrics.compliance;
        return acc;
    }, { financial: 0, safety: 0, performance: 0, compliance: 0 });

    const totalVendors = vendors.length;
    const barData = [
        { name: 'Financial', value: Math.round(avgMetrics.financial / totalVendors) },
        { name: 'Safety', value: Math.round(avgMetrics.safety / totalVendors) },
        { name: 'Performance', value: Math.round(avgMetrics.performance / totalVendors) },
        { name: 'Compliance', value: Math.round(avgMetrics.compliance / totalVendors) },
    ];

    const highRiskVendors = vendors.filter(v => v.riskLevel === RiskLevel.HIGH || v.riskLevel === RiskLevel.CRITICAL);

    return (
        <div className="animate-fade-in space-y-6 pb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-primary text-white">Risk Analytics</h1>
                    <p className="text-text-secondary mt-1">Portfolio-wide risk assessment and performance metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution Chart */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Icons.Chart size={20} className="text-primary" />
                        Risk Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Average Performance Chart */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Icons.TrendUp size={20} className="text-primary" />
                        Average Portfolio Metrics
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#a6a6a6', fontSize: 12 }} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#10b981' : entry.value > 60 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* High Risk Vendors Table */}
            <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Icons.Warning size={20} className="text-red-400" />
                    High Risk Vendors
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Vendor</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Type</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Risk Level</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Score</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highRiskVendors.length > 0 ? (
                                highRiskVendors.map((vendor) => (
                                    <tr key={vendor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-white font-medium">{vendor.name}</td>
                                        <td className="p-3 text-text-secondary text-sm">{vendor.type}</td>
                                        <td className="p-3">
                                            <RiskBadge level={vendor.riskLevel} />
                                        </td>
                                        <td className="p-3 text-white font-mono">{vendor.overallScore}</td>
                                        <td className="p-3 text-text-secondary text-sm">{vendor.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-text-secondary">
                                        No high risk vendors found in the portfolio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
