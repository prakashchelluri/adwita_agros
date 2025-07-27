import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TechnicianTimeLog } from './technician-time-log.entity';
import { StartTimeLogDto } from './start-time-log.dto';
import { User } from '../users/user.entity';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { EndTimeLogDto } from './end-time-log.dto';

@Injectable()
export class TimeLogsService {
  constructor(
    @InjectRepository(TechnicianTimeLog)
    private readonly timeLogRepository: Repository<TechnicianTimeLog>,
    private readonly serviceRequestService: ServiceRequestsService,
  ) {}

  async startLog(
    startDto: StartTimeLogDto,
    technician: User,
  ): Promise<TechnicianTimeLog> {
    const { serviceRequestId, notes } = startDto;

    // Check if there's already an active log for this technician
    const existingLog = await this.timeLogRepository.findOneBy({
      technician: { id: technician.id },
      endTime: IsNull(),
    });
    if (existingLog) {
      throw new ConflictException('You have an active time log that must be ended first.');
    }

    const serviceRequest = await this.serviceRequestService.findOne(serviceRequestId);

    const newLog = this.timeLogRepository.create({
      serviceRequest,
      technician,
      notes,
      startTime: new Date(),
    });

    return this.timeLogRepository.save(newLog);
  }

  async endLog(id: number, endDto: EndTimeLogDto, technician: User): Promise<TechnicianTimeLog> {
    const timeLog = await this.timeLogRepository.findOneBy({ id });

    if (!timeLog) {
      throw new NotFoundException(`Time log with ID "${id}" not found.`);
    }
    if (timeLog.technician.id !== technician.id) {
      throw new UnauthorizedException('You can only end your own time logs.');
    }

    timeLog.endTime = new Date();
    timeLog.notes = endDto.notes ?? timeLog.notes;
    timeLog.durationMinutes = Math.round((timeLog.endTime.getTime() - timeLog.startTime.getTime()) / 60000);

    return this.timeLogRepository.save(timeLog);
  }

  async findActiveLogForTechnician(technicianId: number): Promise<TechnicianTimeLog | null> {
    return this.timeLogRepository.findOne({
      where: {
        technician: { id: technicianId },
        endTime: IsNull(),
      },
      // Eagerly load related data needed by the UI
      relations: ['serviceRequest', 'serviceRequest.customer'],
    });
  }
}