import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SessionState {
  INITIAL = 'initial',
  AWAITING_SERVICE_TYPE = 'awaiting_service_type',
  AWAITING_NAME = 'awaiting_name',
  AWAITING_CHASSIS_NUMBER = 'awaiting_chassis_number',
  AWAITING_CHASSIS_PHOTO = 'awaiting_chassis_photo',
  AWAITING_LOCATION = 'awaiting_location',
  AWAITING_ALTERNATE_CONTACT = 'awaiting_alternate_contact',
  AWAITING_ISSUE_DESCRIPTION = 'awaiting_issue_description',
  AWAITING_ISSUE_MEDIA = 'awaiting_issue_media',
  COMPLETED = 'completed',
}

@Entity('whatsapp_sessions')
export class WhatsAppSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: SessionState, default: SessionState.INITIAL })
  state: SessionState;

  @Column({ name: 'service_type', nullable: true })
  serviceType: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ name: 'chassis_number', nullable: true })
  chassisNumber: string;

  @Column({ name: 'chassis_photo_url', nullable: true })
  chassisPhotoUrl: string;

  @Column({ name: 'customer_location', nullable: true })
  customerLocation: string;

  @Column({ name: 'alternate_contact', nullable: true })
  alternateContact: string;

  @Column({ name: 'issue_description', type: 'text', nullable: true })
  issueDescription: string;

  @Column({ name: 'issue_media_urls', type: 'jsonb', nullable: true })
  issueMediaUrls: string[];

  @Column({ name: 'last_message_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastMessageAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper method to check if session is expired (24 hours)
  isExpired(): boolean {
    const expiryTime = new Date(this.lastMessageAt);
    expiryTime.setHours(expiryTime.getHours() + 24);
    return new Date() > expiryTime;
  }

  // Helper method to reset session
  reset(): void {
    this.state = SessionState.INITIAL;
    this.serviceType = null;
    this.customerName = null;
    this.chassisNumber = null;
    this.chassisPhotoUrl = null;
    this.customerLocation = null;
    this.alternateContact = null;
    this.issueDescription = null;
    this.issueMediaUrls = null;
    this.lastMessageAt = new Date();
  }
}