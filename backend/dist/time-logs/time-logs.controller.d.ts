import { TimeLogsService } from './time-logs.service';
import { User } from '../users/user.entity';
import { StartTimeLogDto } from './start-time-log.dto';
import { EndTimeLogDto } from './end-time-log.dto';
export declare class TimeLogsController {
    private readonly timeLogsService;
    constructor(timeLogsService: TimeLogsService);
    findActiveLog(technician: User): Promise<import("./technician-time-log.entity").TechnicianTimeLog>;
    startLog(startDto: StartTimeLogDto, technician: User): Promise<import("./technician-time-log.entity").TechnicianTimeLog>;
    endLog(id: number, endDto: EndTimeLogDto, technician: User): Promise<import("./technician-time-log.entity").TechnicianTimeLog>;
}
