import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryPartDto {
  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  quantityOnHand: number;
}