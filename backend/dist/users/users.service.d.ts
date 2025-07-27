import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>>;
    findOneByUsername(username: string): Promise<User | undefined>;
    findOneByIdAndRole(id: number, role?: UserRole): Promise<User>;
    findAllByRole(role: UserRole): Promise<Omit<User, 'passwordHash'>[]>;
}
