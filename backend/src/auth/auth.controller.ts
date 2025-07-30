import { Controller, Post, Body, Logger, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    this.logger.debug(`Login attempt for user: ${loginDto.username}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.debug(`Login successful for user: ${loginDto.username}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for user: ${loginDto.username}`, error.stack);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}