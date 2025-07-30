"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        const usernameLower = createUserDto.username.toLowerCase();
        const existingUser = await this.usersRepository.findOne({
            where: [{ username: usernameLower }, { email: createUserDto.email }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists.');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, saltRounds);
        const newUser = this.usersRepository.create({
            ...createUserDto,
            username: usernameLower,
            passwordHash: hashedPassword,
        });
        const savedUser = await this.usersRepository.save(newUser);
        const { passwordHash, ...result } = savedUser;
        return result;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOneById(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findOneByUsername(username) {
        this.logger.debug(`Finding user by username: ${username}`);
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: username.toLowerCase() })
            .addSelect('user.passwordHash')
            .getOne();
        if (!user) {
            this.logger.warn(`User not found: ${username}`);
        }
        else {
            this.logger.debug(`User found: ${username}`);
        }
        return user;
    }
    async findOneByIdAndRole(id, role = user_role_enum_1.UserRole.TECHNICIAN) {
        const user = await this.usersRepository.findOneBy({ id, role });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" and role "${role}" not found`);
        }
        return user;
    }
    async findAllByRole(role) {
        const users = await this.usersRepository.find({
            where: { role },
            select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
        });
        return users;
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map