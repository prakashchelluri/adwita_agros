import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './service-request.entity';
import { ServiceRequestPartUsed } from './service-request-part-used.entity';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { PublicServiceRequestController } from './public-service-request.controller';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Customer } from '../customers/customer.entity';
import { User } from '../users/user.entity';
import { InventoryPart } from '../inventory/inventory-part.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      ServiceRequestPartUsed,
      Vehicle,
      Customer,
      User,
      InventoryPart,
    ]),
    VehiclesModule,
    CustomersModule,
  ],
  controllers: [ServiceRequestsController, PublicServiceRequestController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService], // Export if other modules need this service
})
export class ServiceRequestsModule {}