import { IsOptional, IsString } from 'class-validator';

export class EndTimeLogDto {
  @IsString()
  @IsOptional()
  notes?: string;
}