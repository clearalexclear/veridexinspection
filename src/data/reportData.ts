export type OverallResult = 'APPROVED' | 'APPROVED WITH RESERVATIONS' | 'REJECTED';
export type Severity = 'critical' | 'major' | 'minor';
export type Status = 'pass' | 'fail' | 'warning' | 'na';
export type RiskLevel = 'low' | 'medium' | 'high';
export type Decision = 'ship' | 'ship-with-corrections' | 'do-not-ship';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface InspectionReport {
  id: string;
  date: string;
  factoryName: string;
  supplierName: string;
  productName: string;
  poNumber: string;
  orderQuantity: number;
  inspectedQuantity: number;
  destinationCountry: string;
  inspectorName: string;
  overallResult: OverallResult;
  qualityScore: number;
  riskLevel: RiskLevel;
  decision: Decision;
  inspectionType: string;
  factoryAddress: string;
  supplierContact: string;
  productCategory: string;
  skuModel: string;
  quantityPacked: number;
  quantityAvailable: number;
  samplingStandard: string;
  inspectionScope: string;
  recommendation: string;
  topReasons: string[];
  nextStep: string;
  inspectorComments: string;
  confidenceScore: number;
  businessImpact: string;
  quickSummary: string;
}

export interface BusinessImpact {
  customerExperience: ImpactLevel;
  compliance: ImpactLevel;
  returnRefund: ImpactLevel;
}

export interface DefectItem {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  quantityAffected: number;
  percentAffected: number;
  recommendedAction: string;
  affectedCartons: string;
  impactDescription: string;
  businessImpact: BusinessImpact;
}

export interface KeyIssue {
  title: string;
  severity: Severity;
  percentAffected: number;
  impactDescription: string;
}

export interface ActionPlanItem {
  issue: string;
  action: string;
  estimatedDays: string;
  priority: PriorityLevel;
}

export interface SupplierScore {
  overall: number;
  qualityConsistency: number;
  packagingAccuracy: number;
  defectRate: number;
  professionalism: number;
  insight: string;
}

export interface ConformityItem {
  name: string;
  status: Status;
  note: string;
}

export interface AQLData {
  inspectionLevel: string;
  sampleSizeCode: string;
  sampleSize: number;
  critical: { accept: number; found: number };
  major: { accept: number; found: number };
  minor: { accept: number; found: number };
  result: Status;
}

export interface ChecklistItem {
  name: string;
  status: Status;
  notes: string;
}

export interface TestItem {
  name: string;
  unitsTested: number;
  passed: number;
  failed: number;
  notes: string;
  status: Status;
}

export interface MeasurementRow {
  parameter: string;
  spec: string;
  actual: string;
  tolerance: string;
  status: Status;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  category: 'product' | 'defect' | 'packaging' | 'carton' | 'labeling' | 'factory';
  defectRef?: string;
}

export interface TimeToFixItem {
  task: string;
  estimatedDays: string;
}

// --- SAMPLE DATA ---

export const sampleReport: InspectionReport = {
  id: 'INS-2026-03847',
  date: '2026-03-18',
  factoryName: 'Guangzhou Topline Manufacturing Co., Ltd.',
  supplierName: 'Shenzhen Brightway Trading Co.',
  productName: 'Stainless Steel Insulated Water Bottle – 750ml',
  poNumber: 'PO-2026-1192',
  orderQuantity: 5000,
  inspectedQuantity: 315,
  destinationCountry: 'United States',
  inspectorName: 'David Chen',
  overallResult: 'APPROVED WITH RESERVATIONS',
  qualityScore: 72,
  riskLevel: 'medium',
  decision: 'ship-with-corrections',
  inspectionType: 'Pre-Shipment Inspection (PSI)',
  factoryAddress: '88 Huangpu Industrial Rd, Baiyun District, Guangzhou 510440, China',
  supplierContact: 'Kevin Wang — kevin.w@brightwaytrading.cn — +86 139 2887 4412',
  productCategory: 'Drinkware / Hydration',
  skuModel: 'BW-ITB-750-BLK',
  quantityPacked: 4820,
  quantityAvailable: 4820,
  samplingStandard: 'ANSI/ASQ Z1.4 (ISO 2859-1)',
  inspectionScope: 'Appearance, dimensions, functionality, packaging, labeling, carton condition, drop test',
  recommendation: 'Shipment is conditionally recommended. Minor packaging inconsistencies and labeling alignment issues were found in approximately 8% of inspected units. Functionality and product integrity are acceptable. Supplier must correct labeling on remaining unpacked units before shipment.',
  topReasons: [
    'Label alignment off-center on 26 units (8.2%)',
    'Inner polybag missing suffocation warning on 11 units',
    'Minor dent on bottle base found on 4 units',
  ],
  nextStep: 'Request supplier corrections and re-inspect labeling before shipment',
  inspectorComments: 'Factory was cooperative throughout the inspection. Production line was clean and organized. Workers appeared adequately trained. However, QC station was understaffed — only 1 QC operator for the entire bottling line. Packing area had moderate humidity, which could affect carton integrity over time. Communication with factory management was smooth. Supplier representative was present on-site and responsive to all requests. Overall factory condition is acceptable but improvements in QC staffing and climate control in the packing area are recommended.',
  confidenceScore: 74,
  businessImpact: 'If shipped as-is, estimated 5–10% return rate and potential Amazon compliance risk due to missing suffocation warnings.',
  quickSummary: 'Shipment is conditionally acceptable but requires labeling corrections and polybag warning labels before shipping.',
};

export const sampleDefects: DefectItem[] = [
  {
    id: 'DEF-001',
    title: 'Label Misalignment',
    severity: 'major',
    description: 'Product label positioned 4–6mm off-center from the designated print area. Visible misalignment affects brand presentation.',
    quantityAffected: 26,
    percentAffected: 8.2,
    recommendedAction: 'Re-label affected units before shipment. Adjust label applicator calibration.',
    affectedCartons: 'Cartons #12, #18, #19, #23, #31',
    impactDescription: 'May cause Amazon ASIN listing rejection and negative customer reviews.',
    businessImpact: { customerExperience: 'medium', compliance: 'high', returnRefund: 'medium' },
  },
  {
    id: 'DEF-002',
    title: 'Missing Suffocation Warning on Polybag',
    severity: 'major',
    description: 'Inner polybag packaging missing required suffocation warning label per US CPSC guidelines.',
    quantityAffected: 11,
    percentAffected: 3.5,
    recommendedAction: 'Apply suffocation warning stickers to all affected polybags. Audit remaining inventory.',
    affectedCartons: 'Cartons #7, #14, #22',
    impactDescription: 'Non-compliant with US CPSC. Could result in marketplace suspension or liability.',
    businessImpact: { customerExperience: 'low', compliance: 'high', returnRefund: 'low' },
  },
  {
    id: 'DEF-003',
    title: 'Minor Base Dent',
    severity: 'minor',
    description: 'Small cosmetic dent (approx 2mm) on bottle base. Does not affect functionality or stability.',
    quantityAffected: 4,
    percentAffected: 1.3,
    recommendedAction: 'Sort and remove affected units from shipment.',
    affectedCartons: 'Carton #9',
    impactDescription: 'Low impact but may affect brand perception for premium positioning.',
    businessImpact: { customerExperience: 'medium', compliance: 'low', returnRefund: 'low' },
  },
  {
    id: 'DEF-004',
    title: 'Color Variation on Lid',
    severity: 'minor',
    description: 'Slight color shade difference on matte black lid compared to approved sample. Barely noticeable under normal lighting.',
    quantityAffected: 8,
    percentAffected: 2.5,
    recommendedAction: 'Accept with notation. Monitor in next production run.',
    affectedCartons: 'Cartons #5, #16',
    impactDescription: 'Minimal risk. Unlikely to be noticed by end consumers.',
    businessImpact: { customerExperience: 'low', compliance: 'low', returnRefund: 'low' },
  },
];

export const sampleKeyIssues: KeyIssue[] = [
  { title: 'Label misalignment', severity: 'major', percentAffected: 8.2, impactDescription: 'May cause Amazon ASIN rejection' },
  { title: 'Missing suffocation warnings', severity: 'major', percentAffected: 3.5, impactDescription: 'Compliance risk in US market' },
  { title: 'Minor cosmetic dents', severity: 'minor', percentAffected: 1.3, impactDescription: 'Low impact but affects brand perception' },
  { title: 'Lid color variation', severity: 'minor', percentAffected: 2.5, impactDescription: 'Minimal — unlikely noticed by consumers' },
];

export const sampleActionPlan: ActionPlanItem[] = [
  { issue: 'Fix labeling alignment', action: 'Re-label affected units and recalibrate applicator', estimatedDays: '1–2 days', priority: 'high' },
  { issue: 'Add suffocation warning labels', action: 'Apply warning stickers to all polybags', estimatedDays: '1 day', priority: 'high' },
  { issue: 'Remove dented units', action: 'Sort and pull 4 affected bottles', estimatedDays: '< 1 day', priority: 'medium' },
  { issue: 'Accept lid color variation', action: 'No action — monitor next batch', estimatedDays: '—', priority: 'low' },
];

export const sampleSupplierScore: SupplierScore = {
  overall: 6.4,
  qualityConsistency: 7,
  packagingAccuracy: 5,
  defectRate: 6,
  professionalism: 8,
  insight: 'This supplier shows moderate reliability. Product quality is acceptable but packaging QC needs improvement. Recommend tighter incoming QC on labeling and polybag compliance for future orders.',
};

export const sampleTimeToFix: TimeToFixItem[] = [
  { task: 'Label corrections', estimatedDays: '1–2 days' },
  { task: 'Polybag warning stickers', estimatedDays: '1 day' },
  { task: 'Remove defective units', estimatedDays: '< 1 day' },
  { task: 'Full compliance achieved', estimatedDays: '3–5 days total' },
];

export const sampleConformity: ConformityItem[] = [
  { name: 'Product Dimensions', status: 'pass', note: 'Within tolerance on all sampled units.' },
  { name: 'Weight', status: 'pass', note: 'Average 342g vs spec 340g ± 10g.' },
  { name: 'Color Consistency', status: 'warning', note: 'Slight shade variation on lid batch. See DEF-004.' },
  { name: 'Material Conformity', status: 'pass', note: '18/8 stainless steel confirmed. BPA-free lid verified.' },
  { name: 'Functionality', status: 'pass', note: 'Leak test passed on all 315 units. Vacuum seal intact.' },
  { name: 'Workmanship', status: 'pass', note: 'Clean welds, smooth finish, no burrs detected.' },
  { name: 'Logo / Branding', status: 'pass', note: 'Logo print matches approved artwork. Position correct.' },
  { name: 'Labeling / Barcode / SKU', status: 'fail', note: 'Label misalignment on 8.2% of units. See DEF-001.' },
  { name: 'Packaging Conformity', status: 'warning', note: 'Polybag warning missing on some units. See DEF-002.' },
];

export const sampleAQL: AQLData = {
  inspectionLevel: 'General Inspection Level II',
  sampleSizeCode: 'L',
  sampleSize: 315,
  critical: { accept: 0, found: 0 },
  major: { accept: 7, found: 37 },
  minor: { accept: 10, found: 12 },
  result: 'fail',
};

export const samplePackagingChecklist: ChecklistItem[] = [
  { name: 'Inner Packaging (Polybag)', status: 'warning', notes: '11 units missing suffocation warning.' },
  { name: 'Outer Carton Condition', status: 'pass', notes: 'Double-wall corrugated. Good structural integrity.' },
  { name: 'Shipping Marks', status: 'pass', notes: 'PO number, destination, quantity printed correctly.' },
  { name: 'Barcode Readability', status: 'pass', notes: 'Scanned successfully on all tested units.' },
  { name: 'FNSKU / SKU Label', status: 'fail', notes: 'Alignment issues on 26 units.' },
  { name: 'Country of Origin Marking', status: 'pass', notes: '"Made in China" printed on product and carton.' },
  { name: 'Warning Labels', status: 'warning', notes: 'Present on product but missing on some polybags.' },
  { name: 'Polybag Suffocation Warning', status: 'fail', notes: 'Missing on 11 polybags.' },
  { name: 'Carton Strength', status: 'pass', notes: 'Burst test: 12 kg/cm² (min required: 10 kg/cm²).' },
  { name: 'Carton Drop Test', status: 'pass', notes: 'Passed 76cm single-corner, edge, and flat drops.' },
];

export const sampleTests: TestItem[] = [
  { name: 'Leak Test (Fill & Invert)', unitsTested: 315, passed: 315, failed: 0, notes: 'No leakage after 5 min inversion.', status: 'pass' },
  { name: 'Vacuum Seal Check', unitsTested: 50, passed: 50, failed: 0, notes: 'Heat retention within spec after 6 hrs.', status: 'pass' },
  { name: 'Lid Closure / Open Test', unitsTested: 315, passed: 313, failed: 2, notes: '2 units had stiff lid thread. Cosmetic only.', status: 'warning' },
  { name: 'Drop Test (1m onto concrete)', unitsTested: 10, passed: 9, failed: 1, notes: '1 unit showed base dent. See DEF-003.', status: 'warning' },
  { name: 'Capacity Verification', unitsTested: 20, passed: 20, failed: 0, notes: 'Avg 752ml. Within spec (750ml ± 5%).', status: 'pass' },
];

export const sampleMeasurements: MeasurementRow[] = [
  { parameter: 'Height (with lid)', spec: '265 mm', actual: '264.8 mm', tolerance: '± 2 mm', status: 'pass' },
  { parameter: 'Diameter (body)', spec: '72 mm', actual: '72.1 mm', tolerance: '± 1 mm', status: 'pass' },
  { parameter: 'Weight (empty)', spec: '340 g', actual: '342 g', tolerance: '± 10 g', status: 'pass' },
  { parameter: 'Wall Thickness', spec: '0.6 mm', actual: '0.58 mm', tolerance: '± 0.05 mm', status: 'warning' },
  { parameter: 'Lid Thread Depth', spec: '8 mm', actual: '8.1 mm', tolerance: '± 0.5 mm', status: 'pass' },
  { parameter: 'Logo Print Position', spec: 'Center ± 2 mm', actual: 'Center + 0.5 mm', tolerance: '± 2 mm', status: 'pass' },
  { parameter: 'Capacity', spec: '750 ml', actual: '752 ml', tolerance: '± 5%', status: 'pass' },
];

export const samplePhotos: PhotoItem[] = [
  { id: 'P001', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop', caption: 'Product front view – approved sample match', category: 'product' },
  { id: 'P002', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=400&fit=crop', caption: 'Product lineup – color consistency check', category: 'product' },
  { id: 'P003', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&h=400&fit=crop', caption: 'Label misalignment detail – DEF-001', category: 'defect', defectRef: 'DEF-001' },
  { id: 'P004', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop', caption: 'Base dent close-up – DEF-003', category: 'defect', defectRef: 'DEF-003' },
  { id: 'P005', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop', caption: 'Inner polybag packaging', category: 'packaging' },
  { id: 'P006', url: 'https://images.unsplash.com/photo-1590247813693-5541d1c573ef?w=600&h=400&fit=crop', caption: 'Outer carton with shipping marks', category: 'carton' },
  { id: 'P007', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop', caption: 'Barcode / SKU label close-up', category: 'labeling' },
  { id: 'P008', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', caption: 'Factory production floor overview', category: 'factory' },
];

export const sampleCartonData = {
  cartonsAvailable: 241,
  quantityPerCarton: 20,
  totalPacked: 4820,
  verificationResult: 'pass' as Status,
  randomCheckNotes: '10 random cartons opened. Quantity matched in all. No mixed SKUs detected.',
  shortShipmentRisk: 'Low – 96.4% of order quantity packed and ready.',
};
