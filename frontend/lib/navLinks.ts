import { UserRole } from './types';

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: Record<UserRole, NavLink[]> = {
  [UserRole.ADMIN]: [
    { href: '/admin', label: 'Admin Dashboard' },
    { href: '/admin/users', label: 'Manage Users' },
    { href: '/admin/service-requests', label: 'All Service Requests' },
    { href: '/admin/inventory', label: 'Inventory' },
  ],
  [UserRole.OPERATOR]: [
    { href: '/operator', label: 'Operator Dashboard' },
    { href: '/operator/service-requests/new', label: 'New Request' },
    { href: '/operator/service-requests', label: 'All Requests' },
    { href: '/operator/inventory', label: 'Inventory' },
  ],
  [UserRole.SUPERVISOR]: [
    { href: '/supervisor', label: 'Supervisor Dashboard' },
    { href: '/supervisor/job-sheets', label: 'Job Sheets' },
    { href: '/supervisor/technician-logs', label: 'Technician Logs' },
  ],
  [UserRole.TECHNICIAN]: [
    { href: '/technician', label: 'My Assigned Jobs' },
    { href: '/technician/time-log', label: 'Log Time' },
  ],
  [UserRole.MANUFACTURER]: [{ href: '/manufacturer', label: 'Approval Requests' }],
  [UserRole.MANUFACTURER_WAREHOUSE]: [
    { href: '/manufacturer-warehouse', label: 'Dispatch Parts' },
  ],
};