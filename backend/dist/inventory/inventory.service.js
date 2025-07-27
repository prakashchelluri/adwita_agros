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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_part_entity_1 = require("./inventory-part.entity");
let InventoryService = class InventoryService {
    constructor(inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }
    create(createDto) {
        const part = this.inventoryRepository.create(createDto);
        return this.inventoryRepository.save(part);
    }
    findAll() {
        return this.inventoryRepository.find();
    }
    async findOne(id) {
        const part = await this.inventoryRepository.findOneBy({ id });
        if (!part) {
            throw new common_1.NotFoundException(`Inventory part with ID "${id}" not found`);
        }
        return part;
    }
    async update(id, updateDto) {
        const part = await this.inventoryRepository.preload({ id, ...updateDto });
        if (!part) {
            throw new common_1.NotFoundException(`Inventory part with ID "${id}" not found`);
        }
        return this.inventoryRepository.save(part);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_part_entity_1.InventoryPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map