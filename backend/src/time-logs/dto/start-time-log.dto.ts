import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StartTimeLogDto {
  @IsInt()
  @IsNotEmpty()
  serviceRequestId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
