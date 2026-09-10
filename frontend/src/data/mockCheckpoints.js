export const mockCheckpoints = [
  {
    id: 'demo-north-checkpoint',
    name: 'North Border Checkpoint',
    status: 'Operational',
    queueDepth: 7,
    services: [
      { id: 'scanner', label: 'Document Scanner', status: 'Online' },
      { id: 'camera', label: 'Camera', status: 'Online' },
      { id: 'database', label: 'Database Connection', status: 'Online' },
      { id: 'screening-engine', label: 'Screening Engine', status: 'Operational' },
    ],
  },
];
