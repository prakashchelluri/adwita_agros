import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<Omit<import("./user.entity").User, "passwordHash">>;
    findAllByRole(role: UserRole): Promise<Omit<import("./user.entity").User, "passwordHash">[]>;
}
