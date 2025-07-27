import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSheet } from './job-sheet.entity';
import { CreateJobSheetDto } from './create-job-sheet.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class JobSheetsService {
  constructor(
    @InjectRepository(JobSheet)
    private readonly jobSheetRepository: Repository<JobSheet>,
    private readonly usersService: UsersService,
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  async create(
    createDto: CreateJobSheetDto,
    supervisor: User,
  ): Promise<JobSheet> {
    const { serviceRequestId, technicianId, instructions } = createDto;

    // We need to find the service request by its raw ID, not the full object
    const serviceRequest = await this.serviceRequestsService.findOne(
      serviceRequestId,
    );

    const technician = await this.usersService.findOneByIdAndRole(
      technicianId,
      UserRole.TECHNICIAN,
    );

    const jobSheet = this.jobSheetRepository.create({
      serviceRequest,
      technician,
      supervisor,
      instructions,
    });

    // Also assign the technician to the service request itself
    await this.serviceRequestsService.update(serviceRequestId, {
      assignedTechnicianId: technician.id,
    });

    return this.jobSheetRepository.save(jobSheet);
  }

  findAll(): Promise<JobSheet[]> {
    return this.jobSheetRepository.find({
      relations: ['serviceRequest', 'technician', 'supervisor'],
    });
  }
}