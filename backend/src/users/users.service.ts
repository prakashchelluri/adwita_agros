import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new system user (Admin, Operator, etc.)
   * and securely hashes their password.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Check if a user with the same username or email already exists
    // Convert username to lowercase for case-insensitive comparison
    const usernameLower = createUserDto.username.toLowerCase();
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: usernameLower }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, saltRounds);

    // Store username in lowercase for consistency
    const newUser = this.usersRepository.create({
      ...createUserDto,
      username: usernameLower,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Important: Never return the password hash in the response.
    // We destructure the saved user object to exclude the passwordHash.
    // Destructure to remove passwordHash and return the rest
    const { passwordHash, ...result } = savedUser;
    return result as Omit<User, 'passwordHash'>;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * Finds a single user by their username.
   * This is used by the authentication service.
   * It includes the password hash which is normally excluded.
   */
  async findOneByUsername(username: string): Promise<User | undefined> {
    this.logger.debug(`Finding user by username: ${username}`);
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username.toLowerCase() })
      .addSelect('user.passwordHash')
      .getOne();
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
    } else {
      this.logger.debug(`User found: ${username}`);
    }
    return user;
  }

  /**
   * Finds a single user by ID and optionally checks their role.
   */
  async findOneByIdAndRole(
    id: number,
    role: UserRole = UserRole.TECHNICIAN,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id, role });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" and role "${role}" not found`);
    }
    return user;
  }

  /**
   * Finds all users by their role.
   */
  async findAllByRole(role: UserRole): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.usersRepository.find({
      where: { role },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    return users;
  }

  /**
   * Updates a user by ID.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.passwordHash) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateUserDto.passwordHash, saltRounds);
      user.passwordHash = hashedPassword;
      delete updateUserDto.passwordHash;
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);

    const { passwordHash, ...result } = updatedUser;
    return result;
  }
}