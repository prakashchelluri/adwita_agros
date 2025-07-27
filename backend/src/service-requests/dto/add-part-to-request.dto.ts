import { IsNumber, IsPositive } from 'class-validator';

export class AddPartToRequestDto {
  @IsNumber()
  partId: number;

  @IsNumber()
  @IsPositive()
  quantityUsed: number;
}
