import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianTimeLog } from './technician-time-log.entity';
import { TimeLogsService } from './time-logs.service';
import { TimeLogsController } from './time-logs.controller';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicianTimeLog]), ServiceRequestsModule],
  providers: [TimeLogsService],
  controllers: [TimeLogsController],
})
export class TimeLogsModule {}