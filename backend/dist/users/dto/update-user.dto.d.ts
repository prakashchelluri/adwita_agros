import { UserRole } from '../../common/enums/user-role.enum';
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    passwordHash?: string;
    fullName?: string;
    role?: UserRole;
}
