import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddPartToRequestDto {
  @IsInt()
  @IsNotEmpty()
  partId: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantityUsed: number;
}