import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { UserRole } from './common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init(); // This ensures all modules are initialized

  try {
    const dataSource = app.get(getDataSourceToken());
    if (!(dataSource instanceof DataSource)) {
      throw new Error('Failed to get DataSource');
    }
    const userRepository = dataSource.getRepository(User);

    const users = [
      { username: 'admin', password: 'password', role: UserRole.ADMIN },
      { username: 'operator', password: 'password', role: UserRole.OPERATOR },
      { username: 'supervisor', password: 'password', role: UserRole.SUPERVISOR },
      { username: 'tech', password: 'password', role: UserRole.TECHNICIAN },
      { username: 'manufacturer', password: 'password', role: UserRole.MANUFACTURER },
      { username: 'warehouse', password: 'password', role: UserRole.MANUFACTURER_WAREHOUSE },
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
      } else {
        console.log(`User ${userData.username} already exists.`);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await app.close();
  }
}

bootstrap();