import { IsEnum, IsOptional, IsString, IsBooleanString, IsNumberString } from 'class-validator';
import { RequestStatus } from '../common/enums/request-status.enum';
import { RequestType } from '../common/enums/request-type.enum';

export class QueryServiceRequestDto {
  @IsOptional()
  @IsString()
  chassisNumber?: string;

  @IsOptional()
  @IsString()
  ticketNumber?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @IsOptional()
  @IsBooleanString() // Use IsBooleanString because query params are strings
  isWarrantyEligible?: boolean;

  @IsOptional()
  @IsNumberString()
  assignedTechnicianId?: number;
}