import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  primaryPhone: string;

  @Column({ type: 'jsonb', nullable: true })
  alternatePhones?: string[];

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Vehicle, vehicle => vehicle.customer)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;
}