export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  TECHNICIAN = 'TECHNICIAN',
  MANUFACTURER = 'MANUFACTURER',
  MANUFACTURER_WAREHOUSE = 'MANUFACTURER_WAREHOUSE',
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export enum RequestType {
  OIL_CHANGE_SERVICE = 'oil_change_service',
  VEHICLE_BREAKDOWN = 'vehicle_breakdown',
  WARRANTY_CLAIM = 'warranty_claim',
  OTHER = 'other',
}

export enum RequestStatus {
  NEW = 'new',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  PARTS_ORDERED = 'parts_ordered',
  PARTS_RECEIVED = 'parts_received',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export interface Customer {
  id: number;
  fullName: string;
  primaryPhone: string;
}

export interface Vehicle {
  id: number;
  chassisNumber: string;
  purchaseDate: string;
}

export interface InventoryPart {
  id: number;
  partNumber: string;
  name: string;
}

export interface ServiceRequestPartUsed {
  id: number;
  quantityUsed: number;
  part: InventoryPart;
}

export interface ServiceRequest {
  id: number;
  ticketNumber: string;
  type: RequestType;
  status: RequestStatus;
  issueDescription: string;
  customerLocation?: string;
  isWarrantyEligible: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  customer: Customer;
  vehicle: Vehicle;
  assignedTechnician: User | null;
  partsUsed: ServiceRequestPartUsed[];
  manufacturerApprovalStatus: RequestStatus;
  manufacturerApprovalNotes?: string;
}

export interface WeeklyTechnicianHours {
  technicianName: string;
  totalHours: number;
}

export interface CustomerComplaint {
  customerName: string;
  complaintCount: string;
}

export interface TicketStatusCount {
  status: RequestStatus;
  count: string;
}

export interface AdminMetrics {
  weeklyTechnicianHours: WeeklyTechnicianHours[];
  customerComplaintsLast6Months: CustomerComplaint[];
  overallTicketStatusCounts: TicketStatusCount[];
}

export interface TechnicianTimeLog {
  id: number;
  startTime: string;
  endTime: string | null;
  notes?: string;
  durationMinutes?: number;
  serviceRequest: ServiceRequest;
}