import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  chassisNumber: string;

  @IsOptional()
  @IsString()
  engineNumber?: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsDateString()
  purchaseDate: string;

  @IsOptional()
  @IsNumber()
  warrantyPeriodMonths?: number = 12;

  @IsOptional()
  @IsBoolean()
  isWarrantyActive?: boolean = true;

  @IsNumber()
  customerId: number;
}