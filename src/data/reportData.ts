export type Severity = 'critical' | 'major' | 'minor';
export type Status = 'pass' | 'fail' | 'warning' | 'na';

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
  inspectionType: string;
  factoryAddress: string;
  supplierContact: string;
  productCategory: string;
  skuModel: string;
  quantityPacked: number;
  quantityAvailable: number;
  samplingStandard: string;
  inspectionScope: string;
  inspectorComments: string;
}

export interface DefectItem {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  quantityAffected: number;
  percentAffected: number;
  affectedCartons: string;
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

export interface ItemDefect {
  description: string;
  severity: Severity;
  quantityAffected: number;
}

export interface ItemPackaging {
  method: string;
  cartonSize: string;
  cartonWeight: string;
  issues: string[];
}

export interface ItemTest {
  name: string;
  result: Status;
  comments: string;
}

export interface ShipmentItem {
  itemName: string;
  colorVariant: string;
  orderQuantity: number;
  packedQuantity: number;
  cartonsCount: number;
  unitsPerCarton: number;
  totalUnits: number;
  defects: {
    critical: ItemDefect[];
    major: ItemDefect[];
    minor: ItemDefect[];
  };
  packaging: ItemPackaging;
  tests: ItemTest[];
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
  inspectionType: 'Pre-Shipment Inspection (PSI)',
  factoryAddress: '88 Huangpu Industrial Rd, Baiyun District, Guangzhou 510440, China',
  supplierContact: 'Kevin Wang — kevin.w@brightwaytrading.cn — +86 139 2887 4412',
  productCategory: 'Drinkware / Hydration',
  skuModel: 'BW-ITB-750-BLK',
  quantityPacked: 4820,
  quantityAvailable: 4820,
  samplingStandard: 'ANSI/ASQ Z1.4 (ISO 2859-1)',
  inspectionScope: 'Appearance, dimensions, functionality, packaging, labeling, carton condition, drop test',
  inspectorComments: 'Factory was cooperative throughout the inspection. Production line was clean and organized. Workers appeared adequately trained. However, QC station was understaffed — only 1 QC operator for the entire bottling line. Packing area had moderate humidity, which could affect carton integrity over time. Communication with factory management was smooth. Supplier representative was present on-site and responsive to all requests.',
};

export const sampleDefects: DefectItem[] = [
  {
    id: 'DEF-001',
    title: 'Label Misalignment',
    severity: 'major',
    description: 'Product label positioned 4–6mm off-center from the designated print area.',
    quantityAffected: 26,
    percentAffected: 8.2,
    affectedCartons: 'Cartons #12, #18, #19, #23, #31',
  },
  {
    id: 'DEF-002',
    title: 'Missing Suffocation Warning on Polybag',
    severity: 'major',
    description: 'Inner polybag packaging missing required suffocation warning label per US CPSC guidelines.',
    quantityAffected: 11,
    percentAffected: 3.5,
    affectedCartons: 'Cartons #7, #14, #22',
  },
  {
    id: 'DEF-003',
    title: 'Minor Base Dent',
    severity: 'minor',
    description: 'Small cosmetic dent (approx 2mm) on bottle base. Does not affect functionality or stability.',
    quantityAffected: 4,
    percentAffected: 1.3,
    affectedCartons: 'Carton #9',
  },
  {
    id: 'DEF-004',
    title: 'Color Variation on Lid',
    severity: 'minor',
    description: 'Slight color shade difference on matte black lid compared to reference sample.',
    quantityAffected: 8,
    percentAffected: 2.5,
    affectedCartons: 'Cartons #5, #16',
  },
];

export const sampleConformity: ConformityItem[] = [
  { name: 'Product Dimensions', status: 'pass', note: 'Within tolerance on all sampled units.' },
  { name: 'Weight', status: 'pass', note: 'Average 342g vs spec 340g ± 10g.' },
  { name: 'Color Consistency', status: 'warning', note: 'Slight shade variation on lid batch. See DEF-004.' },
  { name: 'Material Conformity', status: 'pass', note: '18/8 stainless steel confirmed. BPA-free lid verified.' },
  { name: 'Functionality', status: 'pass', note: 'Leak test passed on all 315 units. Vacuum seal intact.' },
  { name: 'Workmanship', status: 'pass', note: 'Clean welds, smooth finish, no burrs detected.' },
  { name: 'Logo / Branding', status: 'pass', note: 'Logo print matches reference artwork. Position correct.' },
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
  { name: 'Country of Origin Marking', status: 'pass', notes: '\"Made in China\" printed on product and carton.' },
  { name: 'Warning Labels', status: 'warning', notes: 'Present on product but missing on some polybags.' },
  { name: 'Polybag Suffocation Warning', status: 'fail', notes: 'Missing on 11 polybags.' },
  { name: 'Carton Strength', status: 'pass', notes: 'Burst test: 12 kg/cm² (min required: 10 kg/cm²).' },
  { name: 'Carton Drop Test', status: 'pass', notes: 'Passed 76cm single-corner, edge, and flat drops.' },
];

export const sampleTests: TestItem[] = [
  { name: 'Leak Test (Fill & Invert)', unitsTested: 315, passed: 315, failed: 0, notes: 'No leakage after 5 min inversion.', status: 'pass' },
  { name: 'Vacuum Seal Check', unitsTested: 50, passed: 50, failed: 0, notes: 'Heat retention within spec after 6 hrs.', status: 'pass' },
  { name: 'Lid Closure / Open Test', unitsTested: 315, passed: 313, failed: 2, notes: '2 units had stiff lid thread.', status: 'warning' },
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
  { id: 'P001', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop', caption: 'Product front view – reference sample comparison', category: 'product' },
  { id: 'P002', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=400&fit=crop', caption: 'Product lineup – color consistency check', category: 'product' },
  { id: 'P003', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&h=400&fit=crop', caption: 'Label misalignment detail – DEF-001', category: 'defect', defectRef: 'DEF-001' },
  { id: 'P004', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop', caption: 'Base dent close-up – DEF-003', category: 'defect', defectRef: 'DEF-003' },
  { id: 'P005', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop', caption: 'Inner polybag packaging', category: 'packaging' },
  { id: 'P006', url: 'https://images.unsplash.com/photo-1590247813693-5541d1c573ef?w=600&h=400&fit=crop', caption: 'Outer carton with shipping marks', category: 'carton' },
  { id: 'P007', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop', caption: 'Barcode / SKU label close-up', category: 'labeling' },
  { id: 'P008', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', caption: 'Factory production floor overview', category: 'factory' },
];

export const sampleAmazonReadiness = {
  categories: [
    { name: 'Labeling', status: 'issue' as const, explanation: 'FNSKU labels misaligned on 8.2% of units.' },
    { name: 'Packaging', status: 'issue' as const, explanation: 'Polybag suffocation warnings missing on 11 units.' },
    { name: 'Product Condition', status: 'ok' as const, explanation: 'Minor cosmetic dents on 4 units.' },
    { name: 'Compliance', status: 'issue' as const, explanation: 'Suffocation warning labels missing on some polybags.' },
    { name: 'Carton Quality', status: 'ok' as const, explanation: 'Cartons passed drop test and burst test.' },
  ],
  findings: 'Labeling misalignment and missing suffocation warnings noted on polybags.',
};

export const sampleCartonData = {
  cartonsAvailable: 241,
  quantityPerCarton: 20,
  totalPacked: 4820,
  verificationResult: 'pass' as Status,
  randomCheckNotes: '10 random cartons opened. Quantity matched in all. No mixed SKUs detected.',
  shortShipmentRisk: '',
};

export const sampleShipmentItems: ShipmentItem[] = [
  {
    itemName: 'Stainless Steel Insulated Water Bottle – 750ml',
    colorVariant: 'Matte Black',
    orderQuantity: 3000,
    packedQuantity: 2900,
    cartonsCount: 145,
    unitsPerCarton: 20,
    totalUnits: 2900,
    defects: {
      critical: [],
      major: [
        { description: 'Label misalignment on product body', severity: 'major', quantityAffected: 18 },
        { description: 'Polybag missing suffocation warning', severity: 'major', quantityAffected: 7 },
      ],
      minor: [
        { description: 'Minor base dent', severity: 'minor', quantityAffected: 3 },
        { description: 'Lid color shade variation', severity: 'minor', quantityAffected: 5 },
      ],
    },
    packaging: {
      method: 'Individual polybag + foam insert + outer carton',
      cartonSize: '60 × 40 × 35 cm',
      cartonWeight: '14.2 kg',
      issues: ['Suffocation warning missing on 7 polybags'],
    },
    tests: [
      { name: 'Leak Test', result: 'pass', comments: 'All units passed' },
      { name: 'Drop Test', result: 'warning', comments: '1 unit dented on base' },
    ],
  },
  {
    itemName: 'Stainless Steel Insulated Water Bottle – 750ml',
    colorVariant: 'Arctic White',
    orderQuantity: 2000,
    packedQuantity: 1920,
    cartonsCount: 96,
    unitsPerCarton: 20,
    totalUnits: 1920,
    defects: {
      critical: [],
      major: [
        { description: 'Label misalignment', severity: 'major', quantityAffected: 8 },
        { description: 'Polybag missing suffocation warning', severity: 'major', quantityAffected: 4 },
      ],
      minor: [
        { description: 'Minor base dent', severity: 'minor', quantityAffected: 1 },
        { description: 'Lid color variation', severity: 'minor', quantityAffected: 3 },
      ],
    },
    packaging: {
      method: 'Individual polybag + foam insert + outer carton',
      cartonSize: '60 × 40 × 35 cm',
      cartonWeight: '14.0 kg',
      issues: ['Suffocation warning missing on 4 polybags'],
    },
    tests: [
      { name: 'Leak Test', result: 'pass', comments: 'All units passed' },
      { name: 'Vacuum Seal', result: 'pass', comments: 'Heat retention within spec' },
    ],
  },
];

export const sampleSupplierProfile = {
  supplierName: 'Shenzhen Brightway Trading Co.',
  score: 6.4,
  summary: 'Mid-sized trading company based in Shenzhen, active since 2014. Primarily exports drinkware and kitchenware to North America and Europe. Mixed online reviews with some reports of packaging inconsistencies.',
  factors: [
    { label: 'Business Registration', value: 'Registered since 2014, valid export license', status: 'positive' as const },
    { label: 'Trade History', value: 'Active on major B2B platforms with 200+ transactions', status: 'positive' as const },
    { label: 'Online Reputation', value: 'Mixed reviews — some buyers report labeling issues', status: 'negative' as const },
    { label: 'Certifications', value: 'ISO 9001:2015, FDA registration for food-contact products', status: 'positive' as const },
    { label: 'Packaging Track Record', value: 'Recurring packaging compliance issues across inspections', status: 'negative' as const },
    { label: 'Response Time', value: 'Generally responsive within 24h during business hours', status: 'neutral' as const },
  ],
  sources: [
    'Alibaba supplier profile & transaction history',
    'Global Sources verified manufacturer listing',
    'Import Genius shipment records (US customs data)',
  ],
};
