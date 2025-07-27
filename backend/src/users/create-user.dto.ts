// This file defines the structure of data required to create a new user.
// We use decorators from 'class-validator' to ensure the incoming data is correct.

import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;
}