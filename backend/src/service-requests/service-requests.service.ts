import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { AddPartToRequestDto } from './dto/add-part-to-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Customer } from '../customers/customer.entity';
import { User } from '../users/user.entity';
import { ServiceRequestPartUsed } from './service-request-part-used.entity';
import { InventoryPart } from '../inventory/inventory-part.entity';
import { RequestStatus } from '../common/enums/request-status.enum';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ServiceRequestsService {
  // Standard warranty period in days. This should be moved to a config file later.
  private readonly WARRANTY_PERIOD_DAYS = 365;

  constructor(
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ServiceRequestPartUsed)
    private readonly partUsedRepository: Repository<ServiceRequestPartUsed>,
    @InjectRepository(InventoryPart)
    private readonly inventoryRepository: Repository<InventoryPart>,
  ) {}

  /**
   * Creates a new service request.
   * This is the core logic that handles the initial request from a customer.
   */
  async create(createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const { chassisNumber, customerName, customerPhone, customerId, vehicleId } = createServiceRequestDto;

    let vehicle: Vehicle;
    let customer: Customer;

    // If IDs are provided, use them directly (for authenticated requests)
    if (customerId && vehicleId) {
      customer = await this.customerRepository.findOneBy({ id: customerId });
      vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
      
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
      }
    } else {
      // Legacy flow for public requests (chassis number + customer details)
      vehicle = await this.vehicleRepository.findOne({
        where: { chassisNumber },
        relations: ['customer'],
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with chassis number ${chassisNumber} not found`);
      }

      // Find or create customer
      customer = await this.customerRepository.findOne({
        where: { primaryPhone: customerPhone },
      });

      if (!customer) {
        customer = this.customerRepository.create({
          fullName: customerName,
          primaryPhone: customerPhone,
        });
        await this.customerRepository.save(customer);
      }
    }

    // Check for warranty eligibility using the vehicle's warranty method
    const isWarrantyEligible = vehicle.isUnderWarranty();

    // Generate a unique ticket number
    const ticketNumber = await this._generateTicketNumber();

    // Create and save the new service request
    const newServiceRequest = this.serviceRequestRepository.create({
      ticketNumber,
      customer,
      vehicle,
      type: createServiceRequestDto.type,
      issueDescription: createServiceRequestDto.issueDescription,
      customerLocation: createServiceRequestDto.customerLocation,
      mediaUrls: createServiceRequestDto.mediaUrls || [],
      status: RequestStatus.NEW,
      isWarrantyEligible,
      manufacturerApprovalStatus: RequestStatus.NEW,
    });

    return this.serviceRequestRepository.save(newServiceRequest);
  }

  /**
   * Find all service requests with optional filtering
   */
  async findAll(query: QueryServiceRequestDto = {}): Promise<ServiceRequest[]> {
    const {
      status,
      type,
      isWarrantyEligible,
      assignedTechnicianId,
      customerId,
      vehicleId,
      search,
      page = 1,
      limit = 20,
    } = query;

    const options: FindManyOptions<ServiceRequest> = {
      relations: ['customer', 'vehicle', 'assignedTechnician', 'partsUsed', 'partsUsed.part'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (isWarrantyEligible !== undefined) where.isWarrantyEligible = isWarrantyEligible;
    if (assignedTechnicianId) where.assignedTechnician = { id: assignedTechnicianId };
    if (customerId) where.customer = { id: customerId };
    if (vehicleId) where.vehicle = { id: vehicleId };
    if (search) {
      where.ticketNumber = Like(`%${search}%`);
    }

    options.where = where;

    return this.serviceRequestRepository.find(options);
  }

  /**
   * Find a single service request by ID
   */
  async findOne(id: number): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'vehicle',
        'assignedTechnician',
        'partsUsed',
        'partsUsed.part',
        'timeLogs',
        'timeLogs.technician',
      ],
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return serviceRequest;
  }

  /**
   * Update a service request
   */
  async update(id: number, updateDto: UpdateServiceRequestDto): Promise<ServiceRequest> {
    const serviceRequest = await this.findOne(id);

    // If assigning a technician, validate the user exists and is a technician
    if (updateDto.assignedTechnicianId) {
      const technician = await this.userRepository.findOneBy({
        id: updateDto.assignedTechnicianId,
      });
      
      if (!technician) {
        throw new NotFoundException('Technician not found');
      }
      
      serviceRequest.assignedTechnician = technician;
    }

    // Update other fields
    Object.assign(serviceRequest, updateDto);

    // Set completion date if status is completed
    if (updateDto.status === RequestStatus.COMPLETED) {
      serviceRequest.completedAt = new Date();
    }

    return this.serviceRequestRepository.save(serviceRequest);
  }

  /**
   * Update manufacturer approval status
   */
  async updateApprovalStatus(id: number, approvalDto: UpdateApprovalStatusDto): Promise<ServiceRequest> {
    const serviceRequest = await this.findOne(id);

    serviceRequest.manufacturerApprovalStatus = approvalDto.status;
    serviceRequest.manufacturerApprovalNotes = approvalDto.notes;

    // If approved, update the main status
    if (approvalDto.status === RequestStatus.APPROVED) {
      serviceRequest.status = RequestStatus.APPROVED;
    } else if (approvalDto.status === RequestStatus.REJECTED) {
      serviceRequest.status = RequestStatus.REJECTED;
    }

    return this.serviceRequestRepository.save(serviceRequest);
  }

  /**
   * Add a part to a service request
   */
  async addPartToRequest(id: number, addPartDto: AddPartToRequestDto): Promise<ServiceRequestPartUsed> {
    const serviceRequest = await this.findOne(id);
    
    // Find the inventory part
    const inventoryPart = await this.inventoryRepository.findOneBy({
      id: addPartDto.partId,
    });

    if (!inventoryPart) {
      throw new NotFoundException('Inventory part not found');
    }

    // Check if enough quantity is available
    if (inventoryPart.quantityOnHand < addPartDto.quantityUsed) {
      throw new BadRequestException('Insufficient inventory quantity');
    }

    // Create the part usage record
    const partUsed = this.partUsedRepository.create({
      serviceRequest,
      part: inventoryPart,
      quantityUsed: addPartDto.quantityUsed,
    });

    // Update inventory
    inventoryPart.quantityOnHand -= addPartDto.quantityUsed;
    await this.inventoryRepository.save(inventoryPart);

    return this.partUsedRepository.save(partUsed);
  }

  /**
   * Find service requests by ticket number
   */
  async findByTicketNumber(ticketNumber: string): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { ticketNumber },
      relations: ['customer', 'vehicle', 'assignedTechnician'],
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ticket number ${ticketNumber} not found`);
    }

    return serviceRequest;
  }

  async findAllPublic(): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find();
  }

  /**
   * Get service requests requiring manufacturer approval
   */
  async findPendingApprovals(): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: {
        isWarrantyEligible: true,
        manufacturerApprovalStatus: RequestStatus.NEW,
      },
      relations: ['customer', 'vehicle', 'partsUsed'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Generates a unique ticket number in the format SR-YYYYMMDD-XXX
   * @private
   */
  private async _generateTicketNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    // Find how many tickets were created today to determine the next sequence number
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const countToday = await this.serviceRequestRepository.count({
      where: { createdAt: MoreThanOrEqual(todayStart) },
    });
    const sequence = (countToday + 1).toString().padStart(3, '0');

    return `SR-${datePrefix}-${sequence}`;
  }
}