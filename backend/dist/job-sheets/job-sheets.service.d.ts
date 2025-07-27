import { Repository } from 'typeorm';
import { JobSheet } from './job-sheet.entity';
import { CreateJobSheetDto } from './create-job-sheet.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
export declare class JobSheetsService {
    private readonly jobSheetRepository;
    private readonly usersService;
    private readonly serviceRequestsService;
    constructor(jobSheetRepository: Repository<JobSheet>, usersService: UsersService, serviceRequestsService: ServiceRequestsService);
    create(createDto: CreateJobSheetDto, supervisor: User): Promise<JobSheet>;
    findAll(): Promise<JobSheet[]>;
}
