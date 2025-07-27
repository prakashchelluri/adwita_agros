import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
    findAll(customerId?: string): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    findOne(id: string): Promise<import("./entities/vehicle.entity").Vehicle>;
    findByChassisNumber(chassisNumber: string): Promise<import("./entities/vehicle.entity").Vehicle>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
    remove(id: string): Promise<void>;
    checkWarrantyStatus(id: string): Promise<{
        isUnderWarranty: boolean;
        warrantyEndDate: Date;
        daysRemaining: number;
    }>;
}
