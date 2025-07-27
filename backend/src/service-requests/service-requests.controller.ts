import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { AddPartToRequestDto } from './dto/add-part-to-request.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('service-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body(new ValidationPipe()) createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  findAll(@Query(new ValidationPipe({ transform: true })) query: QueryServiceRequestDto, @GetUser() user: any) {
    if (user.role === UserRole.TECHNICIAN) {
      return this.serviceRequestsService.findAll({ ...query, assignedTechnicianId: user.userId });
    }
    return this.serviceRequestsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR)
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateDto: UpdateServiceRequestDto) {
    return this.serviceRequestsService.update(id, updateDto);
  }

  @Post(':id/parts')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  addPart(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) addPartDto: AddPartToRequestDto) {
    return this.serviceRequestsService.addPartToRequest(id, addPartDto);
  }

  @Patch(':id/approval')
  @Roles(UserRole.MANUFACTURER)
  updateApproval(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) approvalDto: UpdateApprovalStatusDto) {
    return this.serviceRequestsService.updateApprovalStatus(id, approvalDto);
  }
}
