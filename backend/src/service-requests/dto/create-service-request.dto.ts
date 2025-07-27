import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { RequestType } from '../../common/enums/request-type.enum';

export class CreateServiceRequestDto {
  // Customer details from the initial contact (for public requests)
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string; // Primary contact phone

  // Alternative: Use existing customer/vehicle IDs (for authenticated requests)
  @IsOptional()
  customerId?: number;

  @IsOptional()
  vehicleId?: number;

  // Vehicle details (for public requests)
  @IsString()
  @IsOptional()
  @Length(10, 17, { message: 'Chassis number must be between 10 and 17 characters' })
  chassisNumber?: string;

  // Request details
  @IsEnum(RequestType)
  type: RequestType;

  @IsString()
  @IsNotEmpty()
  issueDescription: string;

  @IsString()
  @IsOptional() // Location is not always required
  customerLocation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  mediaUrls?: string[];

  @IsBoolean()
  @IsOptional()
  isWarrantyEligible?: boolean;
}