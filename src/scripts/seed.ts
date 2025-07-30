import { Connection } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';

export async function seed(connection: Connection) {
  const usersService = connection.getCustomRepository(UsersService);

  const users: CreateUserDto[] = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      fullName: 'Admin User',
      role: UserRole.ADMIN,
    },
    {
      username: 'operator',
      email: 'operator@example.com',
      password: 'operatorpassword',
      fullName: 'Operator User',
      role: UserRole.OPERATOR,
    },
    // Add more users as needed
  ];

  for (const user of users) {
    await usersService.create(user);
  }

  console.log('Seed data inserted successfully');
}