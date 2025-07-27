// This file is a blueprint for the 'users' table in our database.
// TypeORM uses this to understand how to interact with the user data.

import { UserRole } from '../common/enums/user-role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RequestType {
  // Add your request types here
  SERVICE_REQUEST = 'service_request',
  MAINTENANCE_REQUEST = 'maintenance_request',
  REPAIR_REQUEST = 'repair_request',
  SUPPORT_REQUEST = 'support_request',
  OTHER_REQUEST = 'other_request',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}