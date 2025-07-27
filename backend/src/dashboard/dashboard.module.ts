import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TechnicianTimeLog } from '../time-logs/technician-time-log.entity';
import { ServiceRequest } from '../service-requests/service-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicianTimeLog, ServiceRequest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}