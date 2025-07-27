import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryPart } from './inventory-part.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryPart])],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}