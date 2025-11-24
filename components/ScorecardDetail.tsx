import React, { useState } from 'react';
import { Vendor, RiskLevel, VendorStatus } from '../types';
import { Icons } from './Icons';
import { GlassCard } from './GlassCard';
import { RiskBadge } from './RiskBadge';
import { assessVendorRisk } from '../services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ScorecardDetailProps {
  vendor: Vendor;
  onBack: () => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
}

export const ScorecardDetail: React.FC<ScorecardDetailProps> = ({ vendor, onBack, onUpdateVendor }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(vendor.aiAnalysis || null);

  // Safety check for metrics to prevent crashes
  const metrics = vendor.metrics || { financialHealth: 0, safetyRecord: 0, projectPerformance: 0, compliance: 0 };

  const radarData = [
    { subject: 'Financial', A: metrics.financialHealth, fullMark: 100 },
    { subject: 'Safety', A: metrics.safetyRecord, fullMark: 100 },
    { subject: 'Performance', A: metrics.projectPerformance, fullMark: 100 },
    { subject: 'Compliance', A: metrics.compliance, fullMark: 100 },
  ];

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await assessVendorRisk(vendor.name, vendor.description, "Project A: Delayed by 2 weeks due to supply. Project B: Completed on time. 1 Safety incident recorded in 2023.");

      const updatedVendor: Vendor = {
        ...vendor,
        metrics: {
          financialHealth: result.financialHealth,
          safetyRecord: result.safetyRecord,
          projectPerformance: result.projectPerformance,
          compliance: result.compliance
        },
        riskLevel: result.riskLevel as RiskLevel,
        overallScore: result.overallScore,
        aiAnalysis: result.summary
      };

      setAiAnalysis(result.summary);
      onUpdateVendor(updatedVendor);
    } catch (e) {
      console.error("AI analysis failed:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveVendor = () => {
    const updatedVendor: Vendor = {
      ...vendor,
      status: VendorStatus.APPROVED
    };
    onUpdateVendor(updatedVendor);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-screen text-white animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="text-text-secondary hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <Icons.ArrowLeft size={20} /> Back to Vendors
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white font-primary">{vendor.name}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${vendor.status === VendorStatus.APPROVED ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {vendor.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {vendor.status !== VendorStatus.APPROVED && (
              <button
                onClick={handleApproveVendor}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
              >
                <Icons.Check size={20} /> Approve Vendor
              </button>
            )}

            <button
              onClick={handleAiAnalysis}
              className="bg-primary hover:bg-primary-light text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-glow-subtle"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Icons.Loader size={20} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Icons.Robot size={20} /> AI Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top Metrics Bar */}
        <GlassCard className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center justify-center border-r border-white/5 last:border-0">
              <p className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-3">Risk Assessment</p>
              <div className="scale-125 transform origin-center">
                <RiskBadge level={vendor.riskLevel} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-r border-white/5 last:border-0">
              <p className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-1">Overall Score</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-6xl font-mono font-bold ${vendor.overallScore >= 80 ? 'text-primary' : vendor.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {vendor.overallScore}
                </span>
                <span className="text-text-secondary text-lg">/100</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-2">Last Audit Date</p>
              <span className="text-xl font-bold text-white font-mono">{vendor.lastAuditDate}</span>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Charts (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {aiAnalysis && (
              <GlassCard className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 shrink-0">
                    <Icons.Robot size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">AI Assessment Summary</h3>
                    <p className="text-text-secondary leading-relaxed text-sm">
                      {aiAnalysis}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="h-[350px] flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Icons.Chart size={20} className="text-primary" />
                  Performance Metrics
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={radarData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="subject" tick={{ fill: '#a6a6a6', fontSize: 11, fontWeight: 500 }} width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="A" barSize={24} radius={[0, 4, 4, 0]}>
                        {radarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.A > 80 ? '#10b981' : entry.A > 60 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="h-[350px] flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Icons.TrendUp size={20} className="text-primary" />
                  Risk Distribution
                </h3>
                <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#a6a6a6', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Vendor"
                        dataKey="A"
                        stroke="#00d6cb"
                        strokeWidth={3}
                        fill="#00d6cb"
                        fillOpacity={0.2}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#00d6cb' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column: Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Building size={20} className="text-text-secondary" />
                Vendor Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-2">Company Description</p>
                  <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {vendor.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-text-secondary">Founded</span>
                    <span className="text-sm font-mono text-white font-bold">2008</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-text-secondary">Employees</span>
                    <span className="text-sm font-mono text-white font-bold">145</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-text-secondary">License</span>
                    <span className="text-sm font-mono text-white font-bold">CA-98221</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Insured</span>
                    <span className="text-sm font-mono text-green-400 flex items-center gap-1 font-bold">
                      <Icons.Check size={14} /> Yes
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {['ISO 9001', 'OSHA 30', 'LEED Silver', 'Minority Owned'].map((cert) => (
                  <span key={cert} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-colors cursor-default">
                    {cert}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Recent Projects</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-white font-medium block">Skyline Tower A</span>
                    <span className="text-xs text-text-secondary">Structural Steel</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">Completed</span>
                </li>
                <li className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-white font-medium block">Metro Station Refit</span>
                    <span className="text-xs text-text-secondary">Electrical</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">In Progress</span>
                </li>
                <li className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-white font-medium block">Harbor Logistics</span>
                    <span className="text-xs text-text-secondary">Concrete</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-text-secondary border border-white/10">Pending</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};