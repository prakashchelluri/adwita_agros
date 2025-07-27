import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { TimeLogsService } from './time-logs.service';
import { GetUser } from '../common/get-user.decorator';
import { User } from '../users/user.entity';
import { StartTimeLogDto } from './start-time-log.dto';
import { EndTimeLogDto } from './end-time-log.dto';

@Controller('time-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Get('active')
  @Roles(UserRole.TECHNICIAN)
  findActiveLog(@GetUser() technician: User) {
    return this.timeLogsService.findActiveLogForTechnician(technician.id);
  }

  @Post('start')
  @Roles(UserRole.TECHNICIAN)
  startLog(@Body(new ValidationPipe()) startDto: StartTimeLogDto, @GetUser() technician: User) {
    return this.timeLogsService.startLog(startDto, technician);
  }

  @Patch(':id/end')
  @Roles(UserRole.TECHNICIAN)
  endLog(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) endDto: EndTimeLogDto,
    @GetUser() technician: User,
  ) {
    return this.timeLogsService.endLog(id, endDto, technician);
  }
}