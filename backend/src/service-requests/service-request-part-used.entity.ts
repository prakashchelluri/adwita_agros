import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('service_request_parts_used')
export class ServiceRequestPartUsed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('ServiceRequest', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_request_id' })
  serviceRequest: any;

  @ManyToOne('InventoryPart')
  @JoinColumn({ name: 'part_id' })
  part: any;

  @Column({ name: 'quantity_used', type: 'integer' })
  quantityUsed: number;
}
