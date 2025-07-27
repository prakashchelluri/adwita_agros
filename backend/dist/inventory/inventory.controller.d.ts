import { InventoryService } from './inventory.service';
import { CreateInventoryPartDto } from './create-inventory-part.dto';
import { UpdateInventoryPartDto } from './update-inventory-part.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createDto: CreateInventoryPartDto): Promise<import("./inventory-part.entity").InventoryPart>;
    findAll(): Promise<import("./inventory-part.entity").InventoryPart[]>;
    findOne(id: number): Promise<import("./inventory-part.entity").InventoryPart>;
    update(id: number, updateDto: UpdateInventoryPartDto): Promise<import("./inventory-part.entity").InventoryPart>;
}
