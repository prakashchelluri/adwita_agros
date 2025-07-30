import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.debug(`Validating user: ${username}`);
    const user = await this.usersService.findOneByUsername(username);
    
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      return null;
    }

    // Handle missing password hash
    if (!user.passwordHash) {
      this.logger.error(`Password hash missing for user: ${username}`);
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (isMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }
    this.logger.warn(`Invalid credentials for user: ${username}`);
    return null;
  }

  async login(loginDto: LoginDto) {
    this.logger.debug(`Attempting login for user: ${loginDto.username}`);
    const user = await this.usersService.findOneByUsername(loginDto.username);
    
    if (!user) {
      this.logger.warn(`User not found: ${loginDto.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Handle missing password hash
    if (!user.passwordHash) {
      this.logger.error(`Password hash missing for user: ${loginDto.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${loginDto.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}