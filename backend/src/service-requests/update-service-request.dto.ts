import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { RequestStatus } from '../common/enums/request-status.enum';

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsNumber()
  assignedTechnicianId?: number;
}