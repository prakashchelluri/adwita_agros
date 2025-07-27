import { UserRole } from '../common/enums/user-role.enum';
export declare enum RequestType {
    SERVICE_REQUEST = "service_request",
    MAINTENANCE_REQUEST = "maintenance_request",
    REPAIR_REQUEST = "repair_request",
    SUPPORT_REQUEST = "support_request",
    OTHER_REQUEST = "other_request"
}
export declare class User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
