"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryPartDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_inventory_part_dto_1 = require("./create-inventory-part.dto");
class UpdateInventoryPartDto extends (0, mapped_types_1.PartialType)(create_inventory_part_dto_1.CreateInventoryPartDto) {
}
exports.UpdateInventoryPartDto = UpdateInventoryPartDto;
//# sourceMappingURL=update-inventory-part.dto.js.map