import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../../common/enums/request-status.enum';

export class UpdateApprovalStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
