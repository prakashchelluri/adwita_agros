"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const user_role_enum_1 = require("../common/enums/user-role.enum");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        console.log('Seeding database...');
        const usersService = app.get(users_service_1.UsersService);
        const testUsers = [
            {
                username: 'admin',
                password: 'password',
                fullName: 'Administrator',
                email: 'admin@adwita.com',
                role: user_role_enum_1.UserRole.ADMIN,
            },
            {
                username: 'operator',
                password: 'password',
                fullName: 'System Operator',
                email: 'operator@adwita.com',
                role: user_role_enum_1.UserRole.OPERATOR,
            },
            {
                username: 'supervisor',
                password: 'password',
                fullName: 'Field Supervisor',
                email: 'supervisor@adwita.com',
                role: user_role_enum_1.UserRole.SUPERVISOR,
            },
            {
                username: 'tech',
                password: 'password',
                fullName: 'Field Technician',
                email: 'tech@adwita.com',
                role: user_role_enum_1.UserRole.TECHNICIAN,
            },
            {
                username: 'manufacturer',
                password: 'password',
                fullName: 'Equipment Manufacturer',
                email: 'manufacturer@adwita.com',
                role: user_role_enum_1.UserRole.MANUFACTURER,
            },
            {
                username: 'warehouse',
                password: 'password',
                fullName: 'Warehouse Manager',
                email: 'warehouse@adwita.com',
                role: user_role_enum_1.UserRole.MANUFACTURER_WAREHOUSE,
            },
        ];
        for (const userData of testUsers) {
            try {
                const existingUser = await usersService
                    .findOneByUsername(userData.username)
                    .catch(() => null);
                if (existingUser) {
                    console.log(`User '${userData.username}' already exists. Skipping.`);
                    continue;
                }
                await usersService.create(userData);
                console.log(`✅ User '${userData.username}' (${userData.role}) created successfully!`);
            }
            catch (error) {
                console.error(`Error creating user '${userData.username}':`, error.message);
            }
        }
        console.log('\n🎉 Database seeding completed!');
        console.log('\nTest Credentials:');
        testUsers.forEach(user => {
            console.log(`${user.role}: ${user.username}/password`);
        });
    }
    catch (error) {
        console.error('Error during database seeding:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map