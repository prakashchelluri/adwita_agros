import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CustomersService } from '../customers/customers.service';

@Controller('public/service-requests')
export class PublicServiceRequestController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
    private readonly vehiclesService: VehiclesService,
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('media', 10)) // Allow up to 10 media files
  async createPublicRequest(
    @Body(new ValidationPipe()) createDto: CreateServiceRequestDto,
    @UploadedFiles() files?: any[],
  ) {
    // Handle file uploads if any
    const mediaUrls: string[] = [];
    if (files && files.length > 0) {
      // TODO: Implement file upload to storage (local/S3)
      // For now, we'll just store the filenames
      mediaUrls.push(...files.map(file => `/uploads/${file.filename}`));
    }

    // Add media URLs to the DTO
    createDto.mediaUrls = [...(createDto.mediaUrls || []), ...mediaUrls];

    // Link vehicle by chassisNumber if provided
    if (createDto.chassisNumber) {
      const vehicle = await this.vehiclesService.findOneByChassisNumber(createDto.chassisNumber);
      if (vehicle) {
        createDto.vehicleId = vehicle.id;
      }
    }

    const serviceRequest = await this.serviceRequestsService.create(createDto);

    return {
      success: true,
      ticketNumber: serviceRequest.ticketNumber,
      message: 'Service request created successfully',
      warrantyStatus: serviceRequest.isWarrantyEligible ? 'Valid' : 'Expired',
    };
  }

  @Get('check-vehicle/:chassisNumber')
  async checkVehicle(@Param('chassisNumber') chassisNumber: string) {
    try {
      const vehicle = await this.vehiclesService.findOneByChassisNumber(chassisNumber);
      const warrantyStatus = await this.vehiclesService.checkWarrantyStatus(vehicle.id);
      
      return {
        found: true,
        vehicle: {
          chassisNumber: vehicle.chassisNumber,
          modelName: vehicle.modelName,
          purchaseDate: vehicle.purchaseDate,
        },
        customer: {
          name: vehicle.customer.fullName,
          phone: vehicle.customer.primaryPhone,
        },
        warranty: {
          isUnderWarranty: warrantyStatus.isUnderWarranty,
          warrantyEndDate: warrantyStatus.warrantyEndDate,
          daysRemaining: warrantyStatus.daysRemaining,
        },
      };
    } catch (error) {
      return {
        found: false,
        message: 'Vehicle not found in our records',
      };
    }
  }

  @Get('status/:ticketNumber')
  async getRequestStatus(@Param('ticketNumber') ticketNumber: string) {
    try {
      const serviceRequest = await this.serviceRequestsService.findByTicketNumber(ticketNumber);
      
      return {
        found: true,
        ticketNumber: serviceRequest.ticketNumber,
        status: serviceRequest.status,
        type: serviceRequest.type,
        createdAt: serviceRequest.createdAt,
        assignedTechnician: serviceRequest.assignedTechnician?.fullName || null,
        manufacturerApprovalStatus: serviceRequest.manufacturerApprovalStatus,
        isWarrantyEligible: serviceRequest.isWarrantyEligible,
      };
    } catch (error) {
      return {
        found: false,
        message: 'Service request not found',
      };
    }
  }

  @Get()
  async getAllPublicRequests() {
    try {
      const requests = await this.serviceRequestsService.findAllPublic();
      return {
        success: true,
        data: requests,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch public service requests',
      };
    }
  }
}