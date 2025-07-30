import { UserRole } from '../../common/enums/user-role.enum';
export declare class CreateUserDto {
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
}
