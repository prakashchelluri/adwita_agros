import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  passwordHash?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  role?: UserRole;
}