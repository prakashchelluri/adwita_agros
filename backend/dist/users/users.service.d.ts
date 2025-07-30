import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>>;
    findAll(): Promise<User[]>;
    findOneById(id: number): Promise<User>;
    findOneByUsername(username: string): Promise<User | undefined>;
    findOneByIdAndRole(id: number, role?: UserRole): Promise<User>;
    findAllByRole(role: UserRole): Promise<Omit<User, 'passwordHash'>[]>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>>;
}
