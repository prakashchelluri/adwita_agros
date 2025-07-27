import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<Omit<User, 'passwordHash'>>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
}
