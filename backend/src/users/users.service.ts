import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new system user (Admin, Operator, etc.)
   * and securely hashes their password.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Check if a user with the same username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Important: Never return the password hash in the response.
    // We destructure the saved user object to exclude the passwordHash.
    const { passwordHash, ...result } = savedUser;
    return result;
  }

  /**
   * Finds a single user by their username.
   * This is used by the authentication service.
   * It includes the password hash which is normally excluded.
   */
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.createQueryBuilder('user').addSelect('user.passwordHash').where('user.username = :username', { username }).getOne();
  }

  /**
   * Finds a single user by ID and optionally checks their role.
   */
  async findOneByIdAndRole(
    id: number,
    role: UserRole = UserRole.TECHNICIAN,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id, role });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" and role "${role}" not found`);
    }
    return user;
  }

  /**
   * Finds all users by their role.
   */
  async findAllByRole(role: UserRole): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepository.find({
      where: { role },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    return users;
  }

  /**
   * Updates a user by ID.
   */
  async update(id: number, updateData: Partial<User>): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    Object.assign(user, updateData);

    const updatedUser = await this.userRepository.save(user);

    const { passwordHash, ...result } = updatedUser;
    return result;
  }
}
