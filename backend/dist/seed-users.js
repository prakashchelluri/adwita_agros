"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./users/user.entity");
const user_role_enum_1 = require("./common/enums/user-role.enum");
const bcrypt = require("bcrypt");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    try {
        const dataSource = app.get((0, typeorm_1.getDataSourceToken)());
        if (!(dataSource instanceof typeorm_2.DataSource)) {
            throw new Error('Failed to get DataSource');
        }
        const userRepository = dataSource.getRepository(user_entity_1.User);
        const users = [
            { username: 'admin', password: 'password', role: user_role_enum_1.UserRole.ADMIN },
            { username: 'operator', password: 'password', role: user_role_enum_1.UserRole.OPERATOR },
            { username: 'supervisor', password: 'password', role: user_role_enum_1.UserRole.SUPERVISOR },
            { username: 'tech', password: 'password', role: user_role_enum_1.UserRole.TECHNICIAN },
            { username: 'manufacturer', password: 'password', role: user_role_enum_1.UserRole.MANUFACTURER },
            { username: 'warehouse', password: 'password', role: user_role_enum_1.UserRole.MANUFACTURER_WAREHOUSE },
        ];
        for (const userData of users) {
            const existingUser = await userRepository.findOne({ where: { username: userData.username } });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = userRepository.create({
                    username: userData.username,
                    passwordHash: hashedPassword,
                    email: `${userData.username}@example.com`,
                    fullName: userData.username.charAt(0).toUpperCase() + userData.username.slice(1),
                    role: userData.role,
                });
                await userRepository.save(user);
                console.log(`User ${userData.username} created successfully.`);
            }
            else {
                console.log(`User ${userData.username} already exists.`);
            }
        }
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed-users.js.map