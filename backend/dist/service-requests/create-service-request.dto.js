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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceRequestDto = void 0;
const class_validator_1 = require("class-validator");
const request_type_enum_1 = require("../../common/enums/request-type.enum");
class CreateServiceRequestDto {
}
exports.CreateServiceRequestDto = CreateServiceRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceRequestDto.prototype, "customerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceRequestDto.prototype, "customerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(10, 17, { message: 'Chassis number must be between 10 and 17 characters' }),
    __metadata("design:type", String)
], CreateServiceRequestDto.prototype, "chassisNumber", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(request_type_enum_1.RequestType),
    __metadata("design:type", typeof (_a = typeof request_type_enum_1.RequestType !== "undefined" && request_type_enum_1.RequestType) === "function" ? _a : Object)
], CreateServiceRequestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceRequestDto.prototype, "issueDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceRequestDto.prototype, "customerLocation", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateServiceRequestDto.prototype, "mediaUrls", void 0);
//# sourceMappingURL=create-service-request.dto.js.map