import {
  Activity,
  Bell,
  FileBarChart2,
  FileBarChart,
  History,
  LayoutDashboard,
  ListOrdered,
  MapPinned,
  Settings,
  ScanLine,
  Search,
  ShieldCheck,
  UsersRound,
  Upload,
} from 'lucide-react';

export const dutyOfficerNavigation = [
  { label: 'Dashboard', to: '/duty-officer/dashboard', icon: LayoutDashboard },
  { label: 'Live Screening', to: '/duty-officer/screening', icon: Activity },
  { label: 'Upload Documents', to: '/duty-officer/documents', icon: Upload },
  {
    label: 'Passenger History',
    to: '/duty-officer/passengers/history',
    icon: History,
    activePaths: ['/duty-officer/passengers'],
  },
  { label: 'Alerts', to: '/duty-officer/alerts', icon: Bell },
  { label: 'Reports', to: '/duty-officer/reports', icon: FileBarChart },
];

export const dutyOfficerQuickActions = [
  {
    label: 'Start New Screening',
    to: '/duty-officer/screening',
    icon: ScanLine,
    variant: 'primary',
  },
  { label: 'Upload Documents', to: '/duty-officer/documents', icon: Upload, variant: 'outline' },
  {
    label: 'View Live Queue',
    to: '/duty-officer/screening/queue',
    icon: ListOrdered,
    variant: 'outline',
  },
];

export const adminNavigation = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Checkpoints', to: '/admin/checkpoints', icon: MapPinned },
  { label: 'Officers', to: '/admin/officers', icon: UsersRound },
  { label: 'Passenger Intelligence', to: '/admin/passengers', icon: Search },
  { label: 'History', to: '/admin/history', icon: History },
  { label: 'Alerts', to: '/admin/alerts', icon: Bell },
  { label: 'Reports', to: '/admin/reports', icon: FileBarChart2 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export const adminQuickActions = [
  { label: 'Manage Checkpoints', to: '/admin/checkpoints', icon: MapPinned, variant: 'primary' },
  { label: 'Assign Officers', to: '/admin/officers', icon: ShieldCheck, variant: 'outline' },
  { label: 'Review Alerts', to: '/admin/alerts', icon: Bell, variant: 'outline' },
];

export const surveillanceNavigation = [
  { label: 'Command Center', to: '/surveillance', icon: LayoutDashboard },
  { label: 'My Checkpoints', to: '/surveillance/checkpoints', icon: MapPinned },
  { label: 'Live Screening', to: '/surveillance/screening', icon: Activity },
  { label: 'Alerts', to: '/surveillance/alerts', icon: Bell },
  { label: 'Officers', to: '/surveillance/officers', icon: UsersRound },
  { label: 'History', to: '/surveillance/history', icon: History },
  { label: 'Reports', to: '/surveillance/reports', icon: FileBarChart },
];
