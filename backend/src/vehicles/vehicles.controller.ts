import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR)
  findAll(@Query('customerId') customerId?: string) {
    if (customerId) {
      return this.vehiclesService.findByCustomerId(+customerId);
    }
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Get('chassis/:chassisNumber')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  findByChassisNumber(@Param('chassisNumber') chassisNumber: string) {
    return this.vehiclesService.findOneByChassisNumber(chassisNumber);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }

  @Get(':id/warranty-status')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  checkWarrantyStatus(@Param('id') id: string) {
    return this.vehiclesService.checkWarrantyStatus(+id);
  }
}