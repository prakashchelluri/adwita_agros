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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: createUserDto.username }, { email: createUserDto.email }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists.');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
        const newUser = this.userRepository.create({
            ...createUserDto,
            passwordHash: hashedPassword,
        });
        const savedUser = await this.userRepository.save(newUser);
        const { passwordHash, ...result } = savedUser;
        return result;
    }
    async findAll() {
        const users = await this.userRepository.find({
            select: ['id', 'username', 'email', 'role', 'fullName', 'createdAt', 'updatedAt'],
        });
        return users;
    }
    async findOneById(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findOneByUsername(username) {
        return this.userRepository.createQueryBuilder('user').addSelect('user.passwordHash').where('user.username = :username', { username }).getOne();
    }
    async findOneByIdAndRole(id, role = user_role_enum_1.UserRole.TECHNICIAN) {
        const user = await this.userRepository.findOneBy({ id, role });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" and role "${role}" not found`);
        }
        return user;
    }
    async findAllByRole(role) {
        const users = await this.userRepository.find({
            where: { role },
            select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
        });
        return users;
    }
    async update(id, updateData) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        if (updateData.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
            updateData.passwordHash = hashedPassword;
            delete updateData.password;
        }
        Object.assign(user, updateData);
        const updatedUser = await this.userRepository.save(user);
        const { passwordHash, ...result } = updatedUser;
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map