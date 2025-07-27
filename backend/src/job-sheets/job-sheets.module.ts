import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSheet } from './job-sheet.entity';
import { JobSheetsService } from './job-sheets.service';
import { JobSheetsController } from './job-sheets.controller';
import { UsersModule } from '../users/users.module';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobSheet]),
    UsersModule,
    ServiceRequestsModule,
  ],
  providers: [JobSheetsService],
  controllers: [JobSheetsController],
})
export class JobSheetsModule {}
