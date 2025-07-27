import { Repository } from 'typeorm';
import { InventoryPart } from './inventory-part.entity';
import { CreateInventoryPartDto } from './create-inventory-part.dto';
import { UpdateInventoryPartDto } from './update-inventory-part.dto';
export declare class InventoryService {
    private readonly inventoryRepository;
    constructor(inventoryRepository: Repository<InventoryPart>);
    create(createDto: CreateInventoryPartDto): Promise<InventoryPart>;
    findAll(): Promise<InventoryPart[]>;
    findOne(id: number): Promise<InventoryPart>;
    update(id: number, updateDto: UpdateInventoryPartDto): Promise<InventoryPart>;
}
