import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { VendorList } from './components/VendorList';
import { ScorecardDetail } from './components/ScorecardDetail';
import { Vendor, RiskLevel, VendorStatus } from './types';
import { QAApprovals } from './components/QAApprovals';
import { RiskAnalytics } from './components/RiskAnalytics';
import { NewVendorModal } from './components/NewVendorModal';

// Mock Data
const MOCK_VENDORS: Vendor[] = [
  {
    id: 'V-1001',
    name: 'Apex Structural Steel',
    type: 'Structural Steel',
    status: VendorStatus.APPROVED,
    riskLevel: RiskLevel.LOW,
    overallScore: 92,
    description: 'Apex Structural Steel specializes in high-rise steel framing and complex architectural metalwork. They have a strong workforce of 150+ union certified welders. Historically, they have delivered 98% of projects on time. Their financial health is robust with low debt ratios.',
    metrics: { financialHealth: 95, safetyRecord: 88, projectPerformance: 98, compliance: 100 },
    lastAuditDate: '2023-11-15'
  },
  {
    id: 'V-1042',
    name: 'Rapid Electrical Systems',
    type: 'Electrical',
    status: VendorStatus.PENDING,
    riskLevel: RiskLevel.MEDIUM,
    overallScore: 74,
    description: 'Mid-sized electrical contractor focusing on commercial fit-outs. Recent expansion has strained their cash flow slightly. Safety record shows minor infractions in the last quarter related to PPE compliance. Work quality is generally high, but administrative reporting is often delayed.',
    metrics: { financialHealth: 65, safetyRecord: 75, projectPerformance: 85, compliance: 70 },
    lastAuditDate: '2024-01-10'
  },
  {
    id: 'V-1089',
    name: 'Concrete Foundations Ltd',
    type: 'Concrete',
    status: VendorStatus.ON_HOLD,
    riskLevel: RiskLevel.HIGH,
    overallScore: 58,
    description: 'Large concrete pour specialist. Recently involved in a legal dispute regarding wage theft, impacting their reputation score significantly. Performance on the last job was satisfactory, but financial liquidity is currently flagged as a concern due to litigation reserves.',
    metrics: { financialHealth: 40, safetyRecord: 60, projectPerformance: 80, compliance: 50 },
    lastAuditDate: '2023-12-05'
  },
  {
    id: 'V-1102',
    name: 'Green HVAC Solutions',
    type: 'Mechanical',
    status: VendorStatus.APPROVED,
    riskLevel: RiskLevel.LOW,
    overallScore: 88,
    description: 'Specializes in LEED certified HVAC installations. Excellent safety culture. Slightly higher price point but impeccable track record for schedule adherence.',
    metrics: { financialHealth: 85, safetyRecord: 95, projectPerformance: 90, compliance: 82 },
    lastAuditDate: '2024-02-01'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [isNewVendorModalOpen, setIsNewVendorModalOpen] = useState(false);

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setActiveTab('vendors'); // Keep highlighted context
  };

  const handleUpdateVendor = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    setSelectedVendor(updatedVendor);
  };

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors(prev => [...prev, newVendor]);
  };

  const renderContent = () => {
    if (selectedVendor) {
      return (
        <ScorecardDetail
          vendor={selectedVendor}
          onBack={() => setSelectedVendor(null)}
          onUpdateVendor={handleUpdateVendor}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard vendors={vendors} onNavigate={setActiveTab} />;
      case 'vendors':
        return (
          <VendorList
            vendors={vendors}
            onSelectVendor={handleVendorSelect}
            onAddVendor={() => setIsNewVendorModalOpen(true)}
          />
        );
      case 'qa':
        return <QAApprovals vendors={vendors} onUpdateVendor={handleUpdateVendor} />;
      case 'analytics':
        return <RiskAnalytics vendors={vendors} />;
      default:
        return <Dashboard vendors={vendors} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-primary selection:bg-primary selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedVendor(null);
      }} />

      <main className="md:ml-64 p-4 md:p-8 min-h-screen relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <NewVendorModal
        isOpen={isNewVendorModalOpen}
        onClose={() => setIsNewVendorModalOpen(false)}
        onSave={handleAddVendor}
      />
    </div>
  );
};

export default App;