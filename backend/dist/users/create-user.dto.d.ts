import { UserRole } from '../common/enums/user-role.enum';
export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
}
