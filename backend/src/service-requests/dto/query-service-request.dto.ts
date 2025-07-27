import { IsOptional, IsEnum, IsBoolean, IsNumber, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RequestStatus } from '../../common/enums/request-status.enum';
import { RequestType } from '../../common/enums/request-type.enum';

export class QueryServiceRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isWarrantyEligible?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  assignedTechnicianId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicleId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;
}