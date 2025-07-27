import { Controller, Post, Body, ValidationPipe, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint for creating a new user. This is now protected and only
   * accessible by users with the 'Admin' role.
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR)
  findAllByRole(@Query('role') role: UserRole) {
    if (!role) {
      throw new BadRequestException('Role query parameter is required.');
    }
    return this.usersService.findAllByRole(role);
  }
}