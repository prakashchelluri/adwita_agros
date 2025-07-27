import { RequestStatus } from '../../common/enums/request-status.enum';
import { RequestType } from '../../common/enums/request-type.enum';
export declare class QueryServiceRequestDto {
    status?: RequestStatus;
    type?: RequestType;
    isWarrantyEligible?: boolean;
    assignedTechnicianId?: number;
    customerId?: number;
    vehicleId?: number;
    search?: string;
    page?: number;
    limit?: number;
}
