import { mockAlerts } from './mockAlerts';
import { mockCheckpoints } from './mockCheckpoints';
import { mockOfficers } from './mockOfficers';
import { mockPassengers } from './mockPassengers';
import { mockScreenings } from './mockScreenings';

export const mockDutyDashboard = {
  systemName: 'National Border Identity & Document Screening System',
  checkpoint: mockCheckpoints[0],
  officer: mockOfficers[0],
  passengers: mockPassengers,
  activeScreening: mockScreenings[0],
  alerts: mockAlerts,
  metrics: [
    {
      id: 'screened',
      label: 'Screened Today',
      value: 1284,
      description: 'Completed screenings',
      tone: 'neutral',
    },
    {
      id: 'screening',
      label: 'Currently Screening',
      value: 7,
      description: 'Across checkpoint lanes',
      tone: 'info',
    },
    {
      id: 'cleared',
      label: 'Cleared',
      value: 1241,
      description: 'Low-risk screenings today',
      tone: 'success',
    },
    {
      id: 'medium',
      label: 'Medium Risk',
      value: 31,
      description: 'Referrals today',
      tone: 'warning',
    },
    { id: 'high', label: 'High Risk', value: 12, description: 'Referrals today', tone: 'danger' },
    {
      id: 'average',
      label: 'Average Screening Time',
      value: 42,
      unit: 'sec',
      description: 'Per completed screening',
      tone: 'neutral',
    },
  ],
};
