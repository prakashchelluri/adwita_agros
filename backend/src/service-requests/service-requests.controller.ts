import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { GetUser } from '../common/get-user.decorator';
import { User } from '../users/user.entity';
import { RequestStatus } from '../common/enums/request-status.enum';

@Controller('service-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.SUPERVISOR)
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR, UserRole.TECHNICIAN)
  findAll(@Query() query: QueryServiceRequestDto) {
    return this.serviceRequestsService.findAll(query);
  }

  @Get('public')
  findPublicRequests(@Query() query: QueryServiceRequestDto) {
    return this.serviceRequestsService.findPublicRequests(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR, UserRole.TECHNICIAN)
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR)
  update(
    @Param('id') id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto
  ) {
    return this.serviceRequestsService.update(+id, updateServiceRequestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(+id);
  }

  @Post(':id/send-for-approval')
  @Roles(UserRole.SUPERVISOR, UserRole.ADMIN)
  async sendForApproval(@Param('id') id: string) {
    const request = await this.serviceRequestsService.findOne(+id);
    
    // Update request status to AWAITING_APPROVAL
    request.manufacturerApprovalStatus = RequestStatus.AWAITING_APPROVAL;
    await this.serviceRequestsService.updateApprovalStatus(+id, request);
    
    // In a real app, we would send a notification to the manufacturer here
    console.log(`Sent request ${id} to manufacturer for approval`);
    
    return { message: 'Request sent to manufacturer for approval' };
  }
}
