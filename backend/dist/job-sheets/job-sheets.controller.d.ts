import { JobSheetsService } from './job-sheets.service';
import { CreateJobSheetDto } from './create-job-sheet.dto';
import { User } from '../users/user.entity';
export declare class JobSheetsController {
    private readonly jobSheetsService;
    constructor(jobSheetsService: JobSheetsService);
    create(createDto: CreateJobSheetDto, supervisor: User): Promise<import("./job-sheet.entity").JobSheet>;
    findAll(): Promise<import("./job-sheet.entity").JobSheet[]>;
}
