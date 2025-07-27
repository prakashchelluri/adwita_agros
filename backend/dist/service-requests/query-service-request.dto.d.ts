import { RequestStatus } from '../common/enums/request-status.enum';
import { RequestType } from '../common/enums/request-type.enum';
export declare class QueryServiceRequestDto {
    chassisNumber?: string;
    ticketNumber?: string;
    status?: RequestStatus;
    type?: RequestType;
    isWarrantyEligible?: boolean;
    assignedTechnicianId?: number;
}
