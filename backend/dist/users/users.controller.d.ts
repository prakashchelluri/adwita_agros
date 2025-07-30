import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<Omit<import("./user.entity").User, "passwordHash">>;
    findAllByRole(role?: UserRole): Promise<Omit<import("./user.entity").User, "passwordHash">[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<import("./user.entity").User, "passwordHash">>;
    findOne(id: string): Promise<import("./user.entity").User>;
}
