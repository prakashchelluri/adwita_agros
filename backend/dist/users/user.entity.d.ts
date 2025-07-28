export declare enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    SUPERVISOR = "supervisor",
    TECHNICIAN = "technician",
    MANUFACTURER = "manufacturer",
    MANUFACTURER_WAREHOUSE = "manufacturer_warehouse"
}
export declare class User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    password?: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
