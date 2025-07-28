import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { RequestStatus } from '../common/enums/request-status.enum';

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
    // Implement query logic based on parameters
    return this.serviceRequestRepository.find();
  }

  async findPublicRequests(query: QueryServiceRequestDto) {
    // Implement public query logic
    return this.serviceRequestRepository.find();
  }

  async findByTicketNumber(ticketNumber: string) {
    return this.serviceRequestRepository.findOne({ where: { ticketNumber } });
  }

  async findAllPublic() {
    return this.serviceRequestRepository.find();
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

  async updateApprovalStatus(id: number, request: ServiceRequest) {
    // Update only the approval status
    return this.serviceRequestRepository.update(id, {
      manufacturerApprovalStatus: request.manufacturerApprovalStatus
    });
  }
}