import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobSheetDto {
  @IsInt()
  @IsNotEmpty()
  serviceRequestId: number;

  @IsInt()
  @IsNotEmpty()
  technicianId: number;

  @IsString()
  @IsOptional()
  instructions?: string;
}