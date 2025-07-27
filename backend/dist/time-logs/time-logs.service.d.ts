import { Repository } from 'typeorm';
import { TechnicianTimeLog } from './technician-time-log.entity';
import { StartTimeLogDto } from './start-time-log.dto';
import { User } from '../users/user.entity';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { EndTimeLogDto } from './end-time-log.dto';
export declare class TimeLogsService {
    private readonly timeLogRepository;
    private readonly serviceRequestService;
    constructor(timeLogRepository: Repository<TechnicianTimeLog>, serviceRequestService: ServiceRequestsService);
    startLog(startDto: StartTimeLogDto, technician: User): Promise<TechnicianTimeLog>;
    endLog(id: number, endDto: EndTimeLogDto, technician: User): Promise<TechnicianTimeLog>;
    findActiveLogForTechnician(technicianId: number): Promise<TechnicianTimeLog | null>;
}
