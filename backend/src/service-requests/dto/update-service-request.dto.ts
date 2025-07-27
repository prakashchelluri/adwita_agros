import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceRequestDto } from './create-service-request.dto';
import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { RequestStatus } from '../../common/enums/request-status.enum';

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsNumber()
  assignedTechnicianId?: number;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
