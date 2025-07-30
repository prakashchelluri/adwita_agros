import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  // Create a standalone application context
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Seeding database...');
    const usersService = app.get(UsersService);

    // Define test users for all roles
    const testUsers = [
      {
        username: 'admin'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'Administrator',
        email: 'admin@adwita.com',
        role: UserRole.ADMIN,
      },
      {
        username: 'operator'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'System Operator',
        email: 'operator@adwita.com',
        role: UserRole.OPERATOR,
      },
      {
        username: 'supervisor'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'Field Supervisor',
        email: 'supervisor@adwita.com',
        role: UserRole.SUPERVISOR,
      },
      {
        username: 'tech'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'Field Technician',
        email: 'tech@adwita.com',
        role: UserRole.TECHNICIAN,
      },
      {
        username: 'manufacturer'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'Equipment Manufacturer',
        email: 'manufacturer@adwita.com',
        role: UserRole.MANUFACTURER,
      },
      {
        username: 'warehouse'.toLowerCase(),
        passwordHash: 'password',
        fullName: 'Warehouse Manager',
        email: 'warehouse@adwita.com',
        role: UserRole.MANUFACTURER_WAREHOUSE,
      },
    ];

    // Create users if they don't exist
    for (const userData of testUsers) {
      try {
        const existingUser = await usersService
          .findOneByUsername(userData.username)
          .catch(() => null);

        if (existingUser) {
          console.log(`User '${userData.username}' already exists. Skipping.`);
          continue;
        }

        await usersService.create({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          passwordHash: userData.passwordHash, // Pass plain text password to be hashed by service
        });
        console.log(`✅ User '${userData.username}' (${userData.role}) created successfully!`);
      } catch (error) {
        console.error(`Error creating user '${userData.username}':`, error.message);
      }
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\nTest Credentials:');
    testUsers.forEach(user => {
      console.log(`${user.role}: ${user.username}/password`);
    });
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();