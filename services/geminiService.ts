import { AiAssessmentResponse } from "../types";

/**
 * Mock AI service that simulates vendor risk assessment
 * Replaces Gemini AI to avoid API key requirements
 */

// Simulated analysis templates for different risk levels
const mockAnalysisTemplates = {
  low: [
    "Vendor demonstrates excellent financial stability with strong cash reserves and low debt ratios. Safety record is exemplary with no major incidents in the past 24 months. Project delivery consistently meets or exceeds expectations with 95%+ on-time completion rate. All compliance documentation is current and complete.",
    "Outstanding operational track record with robust financial health indicators. Proactive safety culture with industry-leading metrics. Consistently delivers high-quality work within budget and schedule constraints. Maintains all required certifications and insurance coverage.",
    "Strong financial position with consistent profitability and healthy working capital. Exceptional safety performance with comprehensive training programs. Proven track record of successful project completions. Full compliance with all regulatory requirements."
  ],
  medium: [
    "Vendor shows generally stable financial position with some minor cash flow fluctuations. Safety record is acceptable with a few minor infractions requiring corrective action. Project performance is satisfactory but has experienced occasional delays. Compliance documentation is mostly current with some pending updates.",
    "Moderate financial health with recent expansion impacting short-term liquidity. Safety metrics are within acceptable range but show room for improvement. Work quality is generally good though administrative processes need strengthening. Most compliance requirements are met with minor gaps.",
    "Financial indicators show mixed signals with some areas of concern requiring monitoring. Safety record includes minor incidents that have been addressed. Project delivery is adequate but lacks consistency. Compliance status is generally acceptable with some documentation delays."
  ],
  high: [
    "Vendor exhibits concerning financial indicators including elevated debt levels and strained cash flow. Safety record shows multiple infractions and incidents requiring immediate attention. Project performance has been inconsistent with several delays and quality issues. Compliance gaps exist in multiple areas.",
    "Significant financial stress evident with liquidity concerns and delayed payments to suppliers. Safety culture appears weak with recurring violations and inadequate corrective actions. Recent projects have experienced substantial delays and cost overruns. Several compliance deficiencies need urgent remediation.",
    "Financial health is deteriorating with concerning debt-to-equity ratios and declining profitability. Safety incidents have increased in frequency and severity. Project execution has been problematic with quality and schedule issues. Compliance documentation is incomplete or outdated."
  ],
  critical: [
    "Vendor faces severe financial distress with potential insolvency risk. Critical safety violations have occurred with inadequate response. Multiple project failures and contract disputes. Major compliance violations with regulatory exposure.",
    "Extreme financial instability with ongoing legal proceedings and creditor actions. Serious safety incidents with potential regulatory sanctions. Consistent failure to meet contractual obligations. Widespread compliance failures across multiple domains.",
    "Imminent financial collapse with bankruptcy proceedings likely. Catastrophic safety record with worker injuries and regulatory shutdowns. Complete breakdown in project delivery capabilities. Systemic compliance failures with legal ramifications."
  ]
};

/**
 * Generates a realistic risk assessment based on vendor description
 * Uses keyword analysis to determine appropriate risk level and scores
 */
export const assessVendorRisk = async (
  vendorName: string,
  description: string,
  historyData: string
): Promise<AiAssessmentResponse> => {
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

  const combinedText = `${description} ${historyData}`.toLowerCase();

  // Keyword-based risk assessment
  const positiveKeywords = [
    'excellent', 'strong', 'robust', 'exemplary', 'outstanding', 'proven',
    'certified', 'compliant', 'reliable', 'quality', 'professional', 'experienced'
  ];

  const negativeKeywords = [
    'concern', 'issue', 'problem', 'violation', 'incident', 'delay', 'dispute',
    'litigation', 'bankruptcy', 'default', 'failure', 'inadequate', 'poor'
  ];

  const criticalKeywords = [
    'bankruptcy', 'insolvency', 'lawsuit', 'criminal', 'fraud', 'shutdown',
    'catastrophic', 'fatal', 'suspended', 'revoked'
  ];

  // Count keyword occurrences
  const positiveCount = positiveKeywords.filter(kw => combinedText.includes(kw)).length;
  const negativeCount = negativeKeywords.filter(kw => combinedText.includes(kw)).length;
  const criticalCount = criticalKeywords.filter(kw => combinedText.includes(kw)).length;

  // Determine risk level based on keyword analysis
  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  let baseScore: number;

  if (criticalCount > 0) {
    riskLevel = "Critical";
    baseScore = 35 + Math.random() * 20; // 35-55
  } else if (negativeCount > positiveCount + 2) {
    riskLevel = "High";
    baseScore = 50 + Math.random() * 20; // 50-70
  } else if (negativeCount > positiveCount) {
    riskLevel = "Medium";
    baseScore = 65 + Math.random() * 20; // 65-85
  } else {
    riskLevel = "Low";
    baseScore = 80 + Math.random() * 15; // 80-95
  }

  // Generate individual metric scores with realistic variance
  const variance = () => (Math.random() - 0.5) * 15;
  
  const financialHealth = Math.round(Math.max(0, Math.min(100, baseScore + variance())));
  const safetyRecord = Math.round(Math.max(0, Math.min(100, baseScore + variance())));
  const projectPerformance = Math.round(Math.max(0, Math.min(100, baseScore + variance())));
  const compliance = Math.round(Math.max(0, Math.min(100, baseScore + variance())));

  // Calculate weighted overall score
  const overallScore = Math.round(
    financialHealth * 0.3 +
    safetyRecord * 0.3 +
    projectPerformance * 0.25 +
    compliance * 0.15
  );

  // Select appropriate summary template
  const templates = mockAnalysisTemplates[riskLevel.toLowerCase() as keyof typeof mockAnalysisTemplates];
  const summary = templates[Math.floor(Math.random() * templates.length)];

  return {
    riskLevel,
    overallScore,
    financialHealth,
    safetyRecord,
    projectPerformance,
    compliance,
    summary
  };
};