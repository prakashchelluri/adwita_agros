import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('technician_time_logs')
export class TechnicianTimeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('ServiceRequest', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'technician_id' })
  technician: any;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'duration_minutes', type: 'integer', nullable: true })
  durationMinutes?: number;
}
