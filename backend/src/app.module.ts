import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { InventoryModule } from './inventory/inventory.module';
import { JobSheetsModule } from './job-sheets/job-sheets.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './users/user.entity';
import { Customer } from './customers/customer.entity';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { ServiceRequest } from './service-requests/service-request.entity';
import { ServiceRequestPartUsed } from './service-requests/service-request-part-used.entity';
import { InventoryPart } from './inventory/inventory-part.entity';
import { JobSheet } from './job-sheets/job-sheet.entity';
import { TechnicianTimeLog } from './time-logs/technician-time-log.entity';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Set this to false for production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ServiceRequestsModule,
    InventoryModule,
    JobSheetsModule,
    TimeLogsModule,
    DashboardModule,
    CustomersModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}