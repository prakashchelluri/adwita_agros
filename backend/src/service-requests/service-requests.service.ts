import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { RequestStatus } from '../common/enums/request-status.enum';
import { RequestType } from '../common/enums/request-type.enum';

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  async create(createServiceRequestDto: CreateServiceRequestDto) {
    // Generate ticket number if not provided
    if (!createServiceRequestDto.ticketNumber) {
      createServiceRequestDto.ticketNumber = await this.generateTicketNumber();
    }
    const serviceRequest = this.serviceRequestRepository.create(createServiceRequestDto);
    return this.serviceRequestRepository.save(serviceRequest);
  }

  private async generateTicketNumber(): Promise<string> {
    // Generate ticket number in format SR-YYYYMMDD-XXX
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SR-${year}${month}${day}-${random}`;
  }

  async findAll(query: QueryServiceRequestDto) {
    const {
      status,
      type,
      isWarrantyEligible,
      assignedTechnicianId,
      customerId,
      vehicleId,
      search,
      page = 1,
      limit = 20
    } = query;

    const qb = this.serviceRequestRepository.createQueryBuilder('request');
    
    // Add relations
    qb.leftJoinAndSelect('request.customer', 'customer')
     .leftJoinAndSelect('request.vehicle', 'vehicle')
     .leftJoinAndSelect('request.assignedTechnician', 'assignedTechnician');

    // Apply filters
    if (status) qb.andWhere('request.status = :status', { status });
    if (type) qb.andWhere('request.type = :type', { type });
    if (isWarrantyEligible !== undefined)
      qb.andWhere('request.isWarrantyEligible = :isWarrantyEligible', { isWarrantyEligible });
    if (assignedTechnicianId)
      qb.andWhere('request.assignedTechnicianId = :assignedTechnicianId', { assignedTechnicianId });
    if (customerId) qb.andWhere('request.customerId = :customerId', { customerId });
    if (vehicleId) qb.andWhere('request.vehicleId = :vehicleId', { vehicleId });
    
    // Search filter
    if (search) {
      qb.andWhere(
        '(request.ticketNumber LIKE :search OR request.description LIKE :search OR customer.name LIKE :search OR vehicle.licensePlate LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Pagination
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    return qb.getMany();
  }

  async findPublicRequests(query: QueryServiceRequestDto) {
    // Implement public query logic
    return this.serviceRequestRepository.find();
  }

  async findByTicketNumber(ticketNumber: string) {
    return this.serviceRequestRepository.findOne({ where: { ticketNumber } });
  }

  async findAllPublic(): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      relations: ['customer', 'vehicle']
    });
  }

  async findOne(id: number) {
    const request = await this.serviceRequestRepository.findOne({ 
      where: { id },
      relations: ['customer', 'vehicle', 'assignedTechnician', 'partsUsed']
    });
    
    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
    return request;
  }

  async update(id: number, updateServiceRequestDto: UpdateServiceRequestDto) {
    const request = await this.findOne(id);
    Object.assign(request, updateServiceRequestDto);
    return this.serviceRequestRepository.save(request);
  }

  async remove(id: number) {
    const result = await this.serviceRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
  }

  async updateApprovalStatus(id: number, updateData: Partial<ServiceRequest>) {
    await this.serviceRequestRepository.update(id, updateData);
    const updatedRequest = await this.serviceRequestRepository.findOne({ where: { id } });
    if (!updatedRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
    return updatedRequest;
  }
}