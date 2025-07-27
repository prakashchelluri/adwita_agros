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
import { Customer } from '../../customers/customer.entity';
import { ServiceRequest } from '../../service-requests/service-request.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chassis_number', unique: true })
  chassisNumber: string;

  @Column({ name: 'engine_number', nullable: true })
  engineNumber: string;

  @Column({ name: 'model_name', nullable: true })
  modelName: string;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @Column({ name: 'warranty_period_months', default: 12 })
  warrantyPeriodMonths: number;

  @Column({ name: 'is_warranty_active', default: true })
  isWarrantyActive: boolean;

  @ManyToOne(() => Customer, (customer) => customer.vehicles, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => ServiceRequest, (request) => request.vehicle)
  serviceRequests: ServiceRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Method to check if warranty is still valid
  isUnderWarranty(): boolean {
    if (!this.isWarrantyActive) return false;
    
    const warrantyEndDate = new Date(this.purchaseDate);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + this.warrantyPeriodMonths);
    
    return new Date() <= warrantyEndDate;
  }
}