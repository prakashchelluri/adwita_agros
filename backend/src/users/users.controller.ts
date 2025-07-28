import { Controller, Post, Body, ValidationPipe, Get, Query, UseGuards, BadRequestException, Patch, Param } from '@nestjs/common';
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
  async findAllByRole(@Query('role') role?: UserRole) {
    if (!role) {
      // If no role provided, return all users
      return this.usersService.findAll();
    }
    return this.usersService.findAllByRole(role);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateData: Partial<CreateUserDto>) {
    return this.usersService.update(+id, updateData);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }
}
