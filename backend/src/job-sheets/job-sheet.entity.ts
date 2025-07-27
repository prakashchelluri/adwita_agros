import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('job_sheets')
export class JobSheet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne('ServiceRequest', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'technician_id' })
  technician: any;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}