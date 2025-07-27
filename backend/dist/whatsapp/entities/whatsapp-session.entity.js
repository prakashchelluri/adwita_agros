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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppSession = exports.SessionState = void 0;
const typeorm_1 = require("typeorm");
var SessionState;
(function (SessionState) {
    SessionState["INITIAL"] = "initial";
    SessionState["AWAITING_SERVICE_TYPE"] = "awaiting_service_type";
    SessionState["AWAITING_NAME"] = "awaiting_name";
    SessionState["AWAITING_CHASSIS_NUMBER"] = "awaiting_chassis_number";
    SessionState["AWAITING_CHASSIS_PHOTO"] = "awaiting_chassis_photo";
    SessionState["AWAITING_LOCATION"] = "awaiting_location";
    SessionState["AWAITING_ALTERNATE_CONTACT"] = "awaiting_alternate_contact";
    SessionState["AWAITING_ISSUE_DESCRIPTION"] = "awaiting_issue_description";
    SessionState["AWAITING_ISSUE_MEDIA"] = "awaiting_issue_media";
    SessionState["COMPLETED"] = "completed";
})(SessionState || (exports.SessionState = SessionState = {}));
let WhatsAppSession = class WhatsAppSession {
    isExpired() {
        const expiryTime = new Date(this.lastMessageAt);
        expiryTime.setHours(expiryTime.getHours() + 24);
        return new Date() > expiryTime;
    }
    reset() {
        this.state = SessionState.INITIAL;
        this.serviceType = null;
        this.customerName = null;
        this.chassisNumber = null;
        this.chassisPhotoUrl = null;
        this.customerLocation = null;
        this.alternateContact = null;
        this.issueDescription = null;
        this.issueMediaUrls = null;
        this.lastMessageAt = new Date();
    }
};
exports.WhatsAppSession = WhatsAppSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WhatsAppSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', unique: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SessionState, default: SessionState.INITIAL }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_type', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "serviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chassis_number', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "chassisNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chassis_photo_url', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "chassisPhotoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_location', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "customerLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alternate_contact', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "alternateContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WhatsAppSession.prototype, "issueDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_media_urls', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], WhatsAppSession.prototype, "issueMediaUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_message_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], WhatsAppSession.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WhatsAppSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WhatsAppSession.prototype, "updatedAt", void 0);
exports.WhatsAppSession = WhatsAppSession = __decorate([
    (0, typeorm_1.Entity)('whatsapp_sessions')
], WhatsAppSession);
//# sourceMappingURL=whatsapp-session.entity.js.map