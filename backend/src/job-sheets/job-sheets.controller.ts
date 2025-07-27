import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { JobSheetsService } from './job-sheets.service';
import { CreateJobSheetDto } from './create-job-sheet.dto';
import { GetUser } from '../common/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('job-sheets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobSheetsController {
  constructor(private readonly jobSheetsService: JobSheetsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  create(@Body(new ValidationPipe()) createDto: CreateJobSheetDto, @GetUser() supervisor: User) {
    return this.jobSheetsService.create(createDto, supervisor);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  findAll() {
    return this.jobSheetsService.findAll();
  }
}