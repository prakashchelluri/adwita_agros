import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateVehicleWithCustomerDto {
  @IsString()
  @IsNotEmpty()
  chassisNumber: string;

  @IsDateString()
  @IsNotEmpty()
  purchaseDate: string;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  primaryPhone: string;
}
