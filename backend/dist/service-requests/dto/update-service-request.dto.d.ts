import { CreateServiceRequestDto } from './create-service-request.dto';
import { RequestStatus } from '../../common/enums/request-status.enum';
declare const UpdateServiceRequestDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateServiceRequestDto>>;
export declare class UpdateServiceRequestDto extends UpdateServiceRequestDto_base {
    status?: RequestStatus;
    assignedTechnicianId?: number;
    completedAt?: string;
}
export {};
