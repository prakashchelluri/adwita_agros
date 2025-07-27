import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  fullName: string;

  @IsString()
  primaryPhone: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alternatePhones?: string[];

  @IsOptional()
  @IsString()
  address?: string;
}