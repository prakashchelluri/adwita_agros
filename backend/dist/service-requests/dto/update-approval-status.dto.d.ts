import { RequestStatus } from '../../common/enums/request-status.enum';
export declare class UpdateApprovalStatusDto {
    status: RequestStatus;
    notes?: string;
}
