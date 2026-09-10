export const surveillanceStages = [
  'Document Capture',
  'OCR Extraction',
  'Document Validation',
  'MRZ Validation',
  'Database Verification',
  'Tampering Analysis',
  'Face Verification',
  'Identity Matching',
  'Risk Assessment',
];

export const surveillanceCheckpoints = [
  { id: 'SCP-NG-01', name: 'North Gate', region: 'North', type: 'Land Border', status: 'Operational', throughput: 38, queue: 18, activeScreenings: 7, highRisk: 3, mediumRisk: 8, officersOnDuty: 11, requiredOfficers: 10, health: 99.1, lastActivity: 'Just now', lastUpdated: '10:22', notes: 'Primary north corridor screening lanes operating normally.' },
  { id: 'SCP-RC-02', name: 'River Crossing', region: 'West', type: 'River Crossing', status: 'Warning', throughput: 24, queue: 44, activeScreenings: 6, highRisk: 1, mediumRisk: 11, officersOnDuty: 7, requiredOfficers: 9, health: 91.4, lastActivity: '3 min ago', lastUpdated: '10:19', notes: 'Document validation warnings are above normal demo threshold.' },
  { id: 'SCP-EB-03', name: 'East Border Post', region: 'East', type: 'Land Border', status: 'Critical', throughput: 18, queue: 67, activeScreenings: 5, highRisk: 2, mediumRisk: 9, officersOnDuty: 6, requiredOfficers: 10, health: 74.8, lastActivity: '1 min ago', lastUpdated: '10:21', notes: 'Connectivity degraded; monitoring fallback queue.' },
  { id: 'SCP-CT-04', name: 'Central Terminal', region: 'Central', type: 'Airport', status: 'Operational', throughput: 56, queue: 35, activeScreenings: 9, highRisk: 2, mediumRisk: 12, officersOnDuty: 15, requiredOfficers: 14, health: 98.9, lastActivity: 'Just now', lastUpdated: '10:22', notes: 'Peak arrival traffic with acceptable staffing.' },
  { id: 'SCP-WT-05', name: 'West Transit Point', region: 'West', type: 'Transit Point', status: 'Operational', throughput: 14, queue: 11, activeScreenings: 3, highRisk: 1, mediumRisk: 3, officersOnDuty: 5, requiredOfficers: 5, health: 97.6, lastActivity: '8 min ago', lastUpdated: '10:14', notes: 'Transit crew screening nominal.' },
  { id: 'SCP-SG-06', name: 'South Gate', region: 'South', type: 'Land Border', status: 'Operational', throughput: 27, queue: 22, activeScreenings: 4, highRisk: 1, mediumRisk: 4, officersOnDuty: 8, requiredOfficers: 8, health: 99.3, lastActivity: '4 min ago', lastUpdated: '10:18', notes: 'Stable queue and throughput.' },
  { id: 'SCP-MC-07', name: 'Mountain Checkpoint', region: 'North', type: 'Land Border', status: 'Offline', throughput: 0, queue: 0, activeScreenings: 0, highRisk: 0, mediumRisk: 1, officersOnDuty: 2, requiredOfficers: 4, health: 0, lastActivity: '42 min ago', lastUpdated: '09:40', notes: 'Offline in demo state; fallback manual process assumed.' },
  { id: 'SCP-CE-08', name: 'Coastal Entry Point', region: 'South', type: 'Seaport', status: 'Operational', throughput: 31, queue: 19, activeScreenings: 3, highRisk: 2, mediumRisk: 6, officersOnDuty: 9, requiredOfficers: 8, health: 98.2, lastActivity: '2 min ago', lastUpdated: '10:20', notes: 'Maritime passenger screening normal.' },
];

export const surveillancePassengers = [
  { id: 'PAX-2041', nationality: 'Country A', documentType: 'Passport', checkpointId: 'SCP-NG-01', risk: 'High', riskScore: 86, screeningStatus: 'Flagged', identityStatus: 'Warning', documentStatus: 'Passed', faceStatus: 'Warning', mrzStatus: 'Passed', databaseStatus: 'Warning' },
  { id: 'PAX-1987', nationality: 'Country B', documentType: 'Passport', checkpointId: 'SCP-RC-02', risk: 'Medium', riskScore: 58, screeningStatus: 'In Progress', identityStatus: 'Passed', documentStatus: 'Warning', faceStatus: 'Passed', mrzStatus: 'Failed', databaseStatus: 'Passed' },
  { id: 'PAX-2214', nationality: 'Country C', documentType: 'Visa', checkpointId: 'SCP-CE-08', risk: 'Medium', riskScore: 64, screeningStatus: 'Flagged', identityStatus: 'Passed', documentStatus: 'Passed', faceStatus: 'Warning', mrzStatus: 'Passed', databaseStatus: 'Passed' },
  { id: 'PAX-2099', nationality: 'Country D', documentType: 'Passport', checkpointId: 'SCP-CT-04', risk: 'Low', riskScore: 18, screeningStatus: 'Completed', identityStatus: 'Passed', documentStatus: 'Passed', faceStatus: 'Passed', mrzStatus: 'Passed', databaseStatus: 'Passed' },
  { id: 'PAX-2330', nationality: 'Country E', documentType: 'Passport', checkpointId: 'SCP-EB-03', risk: 'High', riskScore: 91, screeningStatus: 'Failed', identityStatus: 'Failed', documentStatus: 'Failed', faceStatus: 'Failed', mrzStatus: 'Warning', databaseStatus: 'Warning' },
  { id: 'PAX-2077', nationality: 'Country F', documentType: 'Crew ID', checkpointId: 'SCP-WT-05', risk: 'Low', riskScore: 22, screeningStatus: 'Completed', identityStatus: 'Passed', documentStatus: 'Passed', faceStatus: 'Passed', mrzStatus: 'Passed', databaseStatus: 'Passed' },
  { id: 'PAX-2146', nationality: 'Country G', documentType: 'Passport', checkpointId: 'SCP-SG-06', risk: 'Medium', riskScore: 49, screeningStatus: 'In Progress', identityStatus: 'Passed', documentStatus: 'Warning', faceStatus: 'Passed', mrzStatus: 'Passed', databaseStatus: 'Unavailable' },
];

export const surveillanceScreenings = [
  { id: 'SCR-1041', passengerId: 'PAX-2041', checkpointId: 'SCP-NG-01', document: 'Passport', currentStage: 'Risk Assessment', progress: 92, risk: 'High', started: '10:05', elapsed: '17 min', status: 'Flagged', completedStages: ['Document Capture', 'OCR Extraction', 'Document Validation', 'MRZ Validation', 'Database Verification', 'Tampering Analysis', 'Face Verification', 'Identity Matching'], failedStages: [], referralStatus: 'Officer review required', officerId: 'SOF-3102' },
  { id: 'SCR-0987', passengerId: 'PAX-1987', checkpointId: 'SCP-RC-02', document: 'Passport', currentStage: 'MRZ Validation', progress: 44, risk: 'Medium', started: '10:11', elapsed: '11 min', status: 'In Progress', completedStages: ['Document Capture', 'OCR Extraction', 'Document Validation'], failedStages: ['MRZ Validation'], referralStatus: 'Document review pending', officerId: 'SOF-3103' },
  { id: 'SCR-1214', passengerId: 'PAX-2214', checkpointId: 'SCP-CE-08', document: 'Visa', currentStage: 'Face Verification', progress: 72, risk: 'Medium', started: '10:09', elapsed: '13 min', status: 'Flagged', completedStages: ['Document Capture', 'OCR Extraction', 'Document Validation', 'MRZ Validation', 'Database Verification', 'Tampering Analysis'], failedStages: ['Face Verification'], referralStatus: 'Face match review', officerId: 'SOF-3106' },
  { id: 'SCR-1099', passengerId: 'PAX-2099', checkpointId: 'SCP-CT-04', document: 'Passport', currentStage: 'Completed', progress: 100, risk: 'Low', started: '10:14', elapsed: '4 min', status: 'Completed', completedStages: surveillanceStages, failedStages: [], referralStatus: 'Cleared', officerId: 'SOF-3101' },
  { id: 'SCR-1330', passengerId: 'PAX-2330', checkpointId: 'SCP-EB-03', document: 'Passport', currentStage: 'Identity Matching', progress: 83, risk: 'High', started: '10:03', elapsed: '19 min', status: 'Failed', completedStages: ['Document Capture', 'OCR Extraction', 'Document Validation', 'MRZ Validation', 'Database Verification', 'Tampering Analysis', 'Face Verification'], failedStages: ['Document Validation', 'Face Verification', 'Identity Matching'], referralStatus: 'Escalated for investigation', officerId: 'SOF-3104' },
  { id: 'SCR-1077', passengerId: 'PAX-2077', checkpointId: 'SCP-WT-05', document: 'Crew ID', currentStage: 'Completed', progress: 100, risk: 'Low', started: '10:16', elapsed: '3 min', status: 'Completed', completedStages: surveillanceStages, failedStages: [], referralStatus: 'Cleared', officerId: 'SOF-3107' },
  { id: 'SCR-1146', passengerId: 'PAX-2146', checkpointId: 'SCP-SG-06', document: 'Passport', currentStage: 'Database Verification', progress: 56, risk: 'Medium', started: '10:15', elapsed: '7 min', status: 'In Progress', completedStages: ['Document Capture', 'OCR Extraction', 'Document Validation', 'MRZ Validation'], failedStages: [], referralStatus: 'Monitoring', officerId: 'SOF-3105' },
];

export const surveillanceOfficers = [
  { id: 'SOF-3101', name: 'Officer A. Malik', role: 'Surveillance Officer', checkpointId: 'SCP-CT-04', shift: '06:00–14:00', status: 'Busy', workload: 78, currentCases: 5, lastActivity: 'Just now', recentActivity: ['Reviewed Central Terminal queue pressure', 'Opened report summary'] },
  { id: 'SOF-3102', name: 'Officer B. Rao', role: 'Duty Officer', checkpointId: 'SCP-NG-01', shift: '06:00–14:00', status: 'Busy', workload: 82, currentCases: 6, lastActivity: '1 min ago', recentActivity: ['Investigating PAX-2041', 'Acknowledged high-risk referral'] },
  { id: 'SOF-3103', name: 'Officer C. Shah', role: 'Duty Officer', checkpointId: 'SCP-RC-02', shift: '08:00–16:00', status: 'Available', workload: 42, currentCases: 2, lastActivity: '3 min ago', recentActivity: ['Reviewed MRZ warning', 'Updated screening note'] },
  { id: 'SOF-3104', name: 'Officer D. Thomas', role: 'Duty Officer', checkpointId: 'SCP-EB-03', shift: '08:00–16:00', status: 'Busy', workload: 91, currentCases: 7, lastActivity: '2 min ago', recentActivity: ['Escalated identity mismatch', 'Monitoring connectivity alert'] },
  { id: 'SOF-3105', name: 'Officer E. Gill', role: 'Duty Officer', checkpointId: 'SCP-SG-06', shift: '06:00–14:00', status: 'Available', workload: 35, currentCases: 1, lastActivity: '6 min ago', recentActivity: ['Cleared screening batch', 'Checked queue status'] },
  { id: 'SOF-3106', name: 'Officer F. Das', role: 'Duty Officer', checkpointId: 'SCP-CE-08', shift: '10:00–18:00', status: 'Busy', workload: 64, currentCases: 3, lastActivity: '4 min ago', recentActivity: ['Reviewed face verification warning', 'Opened passenger PAX-2214'] },
  { id: 'SOF-3107', name: 'Officer G. Menon', role: 'Duty Officer', checkpointId: 'SCP-WT-05', shift: '06:00–14:00', status: 'Off Duty', workload: 12, currentCases: 0, lastActivity: '50 min ago', recentActivity: ['Completed relief shift', 'Closed queue review'] },
  { id: 'SOF-3108', name: 'Officer H. Kapoor', role: 'Admin', checkpointId: 'SCP-MC-07', shift: '09:00–17:00', status: 'Off Duty', workload: 0, currentCases: 0, lastActivity: '1 hr ago', recentActivity: ['Notified of Mountain Checkpoint offline state'] },
];

export const surveillanceAlerts = [
  { id: 'ALT-2041', title: 'High-risk passenger detected', type: 'High-risk passenger', severity: 'Critical', checkpointId: 'SCP-NG-01', reference: 'PAX-2041', created: '10:17', status: 'New', assignedTo: 'SOF-3102', description: 'Automated screening classified PAX-2041 as high risk in the fictional ruleset.', relatedScreeningId: 'SCR-1041', timeline: ['Created 10:17'] },
  { id: 'ALT-1987', title: 'MRZ validation failure', type: 'MRZ failure', severity: 'Warning', checkpointId: 'SCP-RC-02', reference: 'PAX-1987', created: '10:16', status: 'Investigating', assignedTo: 'SOF-3103', description: 'MRZ validation failed during automated document checks.', relatedScreeningId: 'SCR-0987', timeline: ['Created 10:16', 'Acknowledged 10:18', 'Investigating 10:20'] },
  { id: 'ALT-2330', title: 'Identity mismatch and face verification failure', type: 'Identity mismatch', severity: 'Critical', checkpointId: 'SCP-EB-03', reference: 'PAX-2330', created: '10:12', status: 'Acknowledged', assignedTo: 'SOF-3104', description: 'Identity match and face verification failed in demo screening data.', relatedScreeningId: 'SCR-1330', timeline: ['Created 10:12', 'Acknowledged 10:13'] },
  { id: 'ALT-EB-NET', title: 'Checkpoint connectivity degraded', type: 'Network connectivity', severity: 'Warning', checkpointId: 'SCP-EB-03', reference: 'SCP-EB-03', created: '10:09', status: 'New', assignedTo: 'SOF-3104', description: 'East Border Post connectivity health dropped below demo threshold.', relatedScreeningId: null, timeline: ['Created 10:09'] },
  { id: 'ALT-CT-WORK', title: 'Officer workload threshold exceeded', type: 'Officer workload', severity: 'Information', checkpointId: 'SCP-CT-04', reference: 'SOF-3101', created: '10:06', status: 'New', assignedTo: 'SOF-3101', description: 'Central Terminal workload is elevated during peak passenger volume.', relatedScreeningId: null, timeline: ['Created 10:06'] },
  { id: 'ALT-MC-OFF', title: 'Mountain Checkpoint unavailable', type: 'Checkpoint system warning', severity: 'Warning', checkpointId: 'SCP-MC-07', reference: 'SCP-MC-07', created: '09:40', status: 'Investigating', assignedTo: 'SOF-3108', description: 'Mountain Checkpoint is offline in local demo state.', relatedScreeningId: null, timeline: ['Created 09:40', 'Assigned 09:44', 'Investigating 09:48'] },
  { id: 'ALT-2214', title: 'Face verification failure', type: 'Face verification failure', severity: 'Warning', checkpointId: 'SCP-CE-08', reference: 'PAX-2214', created: '10:18', status: 'Resolved', assignedTo: 'SOF-3106', description: 'Face verification warning was resolved after officer review.', relatedScreeningId: 'SCR-1214', timeline: ['Created 10:18', 'Acknowledged 10:19', 'Resolved 10:21'] },
  { id: 'ALT-ENG-01', title: 'Screening engine warning', type: 'Screening engine', severity: 'Information', checkpointId: 'SCP-CT-04', reference: 'Queue Service', created: '10:20', status: 'New', assignedTo: 'SOF-3101', description: 'Queue processing latency increased but remains available.', relatedScreeningId: null, timeline: ['Created 10:20'] },
];

export const surveillanceHealth = [
  { service: 'Document Screening Engine', status: 'Operational', health: 99.3 },
  { service: 'Identity Verification', status: 'Operational', health: 98.8 },
  { service: 'Face Verification', status: 'Degraded', health: 94.7 },
  { service: 'Database Verification', status: 'Operational', health: 99.1 },
  { service: 'Network Connectivity', status: 'Degraded', health: 92.8 },
  { service: 'Screening Queue Service', status: 'Operational', health: 98.5 },
];

export const surveillanceHistory = [
  { id: 'HIS-1001', timestamp: '2026-09-05 10:22', checkpointId: 'SCP-NG-01', event: 'High Risk Referral', reference: 'PAX-2041', risk: 'High', officerId: 'SOF-3102', status: 'Open', action: 'Open passenger investigation', detail: 'High-risk referral generated from risk assessment.' },
  { id: 'HIS-1002', timestamp: '2026-09-05 10:20', checkpointId: 'SCP-CT-04', event: 'System Event', reference: 'Queue Service', risk: 'Low', officerId: 'SOF-3101', status: 'Active', action: 'Monitor queue latency', detail: 'Queue service latency increased during peak load.' },
  { id: 'HIS-1003', timestamp: '2026-09-05 10:18', checkpointId: 'SCP-CE-08', event: 'Alert Resolved', reference: 'ALT-2214', risk: 'Medium', officerId: 'SOF-3106', status: 'Resolved', action: 'Review alert', detail: 'Face verification warning resolved.' },
  { id: 'HIS-1004', timestamp: '2026-09-05 10:16', checkpointId: 'SCP-RC-02', event: 'MRZ Failure', reference: 'PAX-1987', risk: 'Medium', officerId: 'SOF-3103', status: 'Investigating', action: 'Open screening detail', detail: 'MRZ validation failed during document verification.' },
  { id: 'HIS-1005', timestamp: '2026-09-05 10:12', checkpointId: 'SCP-EB-03', event: 'Face Verification Failure', reference: 'PAX-2330', risk: 'High', officerId: 'SOF-3104', status: 'Acknowledged', action: 'Escalate case', detail: 'Identity mismatch and face verification failure detected.' },
  { id: 'HIS-1006', timestamp: '2026-09-05 10:08', checkpointId: 'SCP-SG-06', event: 'Screening Completed', reference: 'PAX-2146', risk: 'Medium', officerId: 'SOF-3105', status: 'In Progress', action: 'Monitor screening', detail: 'Medium-risk document review continuing.' },
  { id: 'HIS-1007', timestamp: '2026-09-05 09:48', checkpointId: 'SCP-MC-07', event: 'Checkpoint Warning', reference: 'SCP-MC-07', risk: 'Low', officerId: 'SOF-3108', status: 'Investigating', action: 'View checkpoint', detail: 'Mountain Checkpoint unavailable in demo state.' },
  { id: 'HIS-1008', timestamp: '2026-09-05 09:44', checkpointId: 'SCP-WT-05', event: 'Officer Activity', reference: 'SOF-3107', risk: 'Low', officerId: 'SOF-3107', status: 'Closed', action: 'View officer activity', detail: 'Relief shift completed.' },
];

export const surveillanceReportTrend = [
  { time: '00:00', low: 720, medium: 4, high: 1, passengers: 820 },
  { time: '04:00', low: 940, medium: 5, high: 0, passengers: 1040 },
  { time: '08:00', low: 2680, medium: 9, high: 3, passengers: 2910 },
  { time: '12:00', low: 5120, medium: 16, high: 5, passengers: 5680 },
  { time: '16:00', low: 4710, medium: 8, high: 2, passengers: 4960 },
  { time: '20:00', low: 3750, medium: 4, high: 1, passengers: 3016 },
];
