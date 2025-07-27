import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

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

export enum RequestType {
  OIL_CHANGE_SERVICE = 'oil_change_service',
  VEHICLE_BREAKDOWN = 'vehicle_breakdown',
  WARRANTY_CLAIM = 'warranty_claim',
  OTHER = 'other',
}

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ticket_number', unique: true })
  ticketNumber: string;

  @ManyToOne('Customer', { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: any;

  @ManyToOne('Vehicle', { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: any;

  @OneToMany('ServiceRequestPartUsed', 'serviceRequest', { eager: true })
  partsUsed: any[];

  @Column({ type: 'enum', enum: RequestType })
  type: RequestType;

  @Column({ name: 'issue_description', type: 'text' })
  issueDescription: string;

  @Column({ name: 'customer_location', nullable: true })
  customerLocation: string;

  @Column({ name: 'media_urls', type: 'jsonb', nullable: true })
  mediaUrls: string[];

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.NEW })
  status: RequestStatus;

  @Column({ name: 'is_warranty_eligible', default: false })
  isWarrantyEligible: boolean;

  @Column({ name: 'manufacturer_approval_status', type: 'enum', enum: RequestStatus, default: RequestStatus.NEW })
  manufacturerApprovalStatus: RequestStatus;

  @Column({ name: 'manufacturer_approval_notes', type: 'text', nullable: true })
  manufacturerApprovalNotes: string;

  @ManyToOne('User', { nullable: true, eager: true })
  @JoinColumn({ name: 'assigned_technician_id' })
  assignedTechnician: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;
}