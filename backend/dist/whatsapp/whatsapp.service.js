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
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
const whatsapp_session_entity_1 = require("./entities/whatsapp-session.entity");
const service_requests_service_1 = require("../service-requests/service-requests.service");
const vehicles_service_1 = require("../vehicles/vehicles.service");
const customers_service_1 = require("../customers/customers.service");
const request_type_enum_1 = require("../common/enums/request-type.enum");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    constructor(sessionRepository, configService, serviceRequestsService, vehiclesService, customersService) {
        this.sessionRepository = sessionRepository;
        this.configService = configService;
        this.serviceRequestsService = serviceRequestsService;
        this.vehiclesService = vehiclesService;
        this.customersService = customersService;
        this.logger = new common_1.Logger(WhatsAppService_1.name);
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (accountSid && authToken) {
            this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
        }
        else {
            this.logger.warn('Twilio credentials not configured');
        }
    }
    async handleIncomingMessage(from, body, mediaUrls) {
        try {
            const phoneNumber = from.replace('whatsapp:', '');
            let session = await this.sessionRepository.findOne({
                where: { phoneNumber },
            });
            if (!session) {
                session = this.sessionRepository.create({
                    phoneNumber,
                    state: whatsapp_session_entity_1.SessionState.INITIAL,
                });
            }
            if (session.isExpired()) {
                session.reset();
            }
            session.lastMessageAt = new Date();
            await this.processMessage(session, body, mediaUrls);
            await this.sessionRepository.save(session);
        }
        catch (error) {
            this.logger.error('Error handling incoming message:', error);
            await this.sendMessage(from, 'Sorry, there was an error processing your message. Please try again.');
        }
    }
    async processMessage(session, body, mediaUrls) {
        const phoneNumber = `whatsapp:${session.phoneNumber}`;
        switch (session.state) {
            case whatsapp_session_entity_1.SessionState.INITIAL:
                await this.handleInitialMessage(session, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_SERVICE_TYPE:
                await this.handleServiceTypeSelection(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_NAME:
                await this.handleNameInput(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_CHASSIS_NUMBER:
                await this.handleChassisNumberInput(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_CHASSIS_PHOTO:
                await this.handleChassisPhotoInput(session, mediaUrls, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_LOCATION:
                await this.handleLocationInput(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_ALTERNATE_CONTACT:
                await this.handleAlternateContactInput(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_ISSUE_DESCRIPTION:
                await this.handleIssueDescriptionInput(session, body, phoneNumber);
                break;
            case whatsapp_session_entity_1.SessionState.AWAITING_ISSUE_MEDIA:
                await this.handleIssueMediaInput(session, body, mediaUrls, phoneNumber);
                break;
            default:
                await this.sendMessage(phoneNumber, 'I didn\'t understand that. Type "start" to begin a new service request.');
        }
    }
    async handleInitialMessage(session, phoneNumber) {
        const welcomeMessage = `🔧 *Welcome to Adwita Agros!*

Thank you for contacting us. Please choose from the options below:

1️⃣ Oil Change/Service
2️⃣ Vehicle Breakdown
3️⃣ Warranty Claim
4️⃣ Other

Please reply with the number (1, 2, 3, or 4) of your choice.`;
        await this.sendMessage(phoneNumber, welcomeMessage);
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_SERVICE_TYPE;
    }
    async handleServiceTypeSelection(session, body, phoneNumber) {
        const choice = body.trim();
        let serviceType;
        switch (choice) {
            case '1':
                serviceType = request_type_enum_1.RequestType.OIL_CHANGE_SERVICE;
                break;
            case '2':
                serviceType = request_type_enum_1.RequestType.VEHICLE_BREAKDOWN;
                break;
            case '3':
                serviceType = request_type_enum_1.RequestType.WARRANTY_CLAIM;
                break;
            case '4':
                serviceType = request_type_enum_1.RequestType.OTHER;
                break;
            default:
                await this.sendMessage(phoneNumber, 'Please select a valid option (1, 2, 3, or 4).');
                return;
        }
        session.serviceType = serviceType;
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_NAME;
        await this.sendMessage(phoneNumber, '👤 Please enter your full name:');
    }
    async handleNameInput(session, body, phoneNumber) {
        if (!body.trim()) {
            await this.sendMessage(phoneNumber, 'Please enter a valid name.');
            return;
        }
        session.customerName = body.trim();
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_CHASSIS_NUMBER;
        await this.sendMessage(phoneNumber, '🔢 Please enter your vehicle chassis number (10 digits):');
    }
    async handleChassisNumberInput(session, body, phoneNumber) {
        const chassisNumber = body.trim().toUpperCase();
        if (chassisNumber.length < 8) {
            await this.sendMessage(phoneNumber, 'Please enter a valid chassis number (at least 8 characters).');
            return;
        }
        session.chassisNumber = chassisNumber;
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_CHASSIS_PHOTO;
        await this.sendMessage(phoneNumber, '📸 Please send a photo of your vehicle chassis number plate (optional - you can type "skip" to continue):');
    }
    async handleChassisPhotoInput(session, mediaUrls, phoneNumber) {
        if (mediaUrls && mediaUrls.length > 0) {
            session.chassisPhotoUrl = mediaUrls[0];
            await this.sendMessage(phoneNumber, '✅ Photo received! Thank you.');
        }
        if (session.serviceType === request_type_enum_1.RequestType.WARRANTY_CLAIM) {
            session.state = whatsapp_session_entity_1.SessionState.AWAITING_ALTERNATE_CONTACT;
            await this.sendMessage(phoneNumber, '📞 Please enter your alternate contact number:');
        }
        else {
            session.state = whatsapp_session_entity_1.SessionState.AWAITING_LOCATION;
            await this.sendMessage(phoneNumber, '📍 Please enter your vehicle current location:');
        }
    }
    async handleLocationInput(session, body, phoneNumber) {
        session.customerLocation = body.trim();
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_ALTERNATE_CONTACT;
        await this.sendMessage(phoneNumber, '📞 Please enter your alternate contact number:');
    }
    async handleAlternateContactInput(session, body, phoneNumber) {
        session.alternateContact = body.trim();
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_ISSUE_DESCRIPTION;
        await this.sendMessage(phoneNumber, '📝 Please describe the issue with your vehicle:');
    }
    async handleIssueDescriptionInput(session, body, phoneNumber) {
        session.issueDescription = body.trim();
        session.state = whatsapp_session_entity_1.SessionState.AWAITING_ISSUE_MEDIA;
        await this.sendMessage(phoneNumber, '📸 Please send photos or videos of the issue (optional - type "done" when finished):');
    }
    async handleIssueMediaInput(session, body, mediaUrls, phoneNumber) {
        if (mediaUrls && mediaUrls.length > 0) {
            if (!session.issueMediaUrls) {
                session.issueMediaUrls = [];
            }
            session.issueMediaUrls.push(...mediaUrls);
            await this.sendMessage(phoneNumber, '✅ Media received! Send more or type "done" to complete.');
            return;
        }
        if (body.toLowerCase().trim() === 'done' || body.toLowerCase().trim() === 'finish') {
            await this.createServiceRequest(session, phoneNumber);
        }
        else {
            await this.sendMessage(phoneNumber, 'Please send media files or type "done" to complete your request.');
        }
    }
    async createServiceRequest(session, phoneNumber) {
        try {
            let customer;
            try {
                customer = await this.customersService.findByPhone(session.phoneNumber);
            }
            catch {
                customer = await this.customersService.create({
                    fullName: session.customerName,
                    primaryPhone: session.phoneNumber,
                    alternatePhones: session.alternateContact ? [session.alternateContact] : [],
                    address: session.customerLocation,
                });
            }
            let vehicle;
            try {
                vehicle = await this.vehiclesService.findOneByChassisNumber(session.chassisNumber);
            }
            catch {
                vehicle = await this.vehiclesService.create({
                    chassisNumber: session.chassisNumber,
                    customerId: customer.id,
                    purchaseDate: new Date().toISOString(),
                });
            }
            const warrantyStatus = await this.vehiclesService.checkWarrantyStatus(vehicle.id);
            const serviceRequest = await this.serviceRequestsService.create({
                customerId: customer.id,
                vehicleId: vehicle.id,
                type: session.serviceType,
                issueDescription: session.issueDescription,
                customerLocation: session.customerLocation,
                mediaUrls: session.issueMediaUrls || [],
                isWarrantyEligible: warrantyStatus.isUnderWarranty,
            });
            const confirmationMessage = `✅ *Service Request Created Successfully!*

🎫 *Ticket Number:* ${serviceRequest.ticketNumber}
🔧 *Service Type:* ${this.getServiceTypeDisplay(session.serviceType)}
🛡️ *Warranty Status:* ${warrantyStatus.isUnderWarranty ? '✅ Valid' : '❌ Expired'}

We have received your request and will contact you soon. Please save your ticket number for future reference.

Thank you for choosing Adwita Agros! 🚜`;
            await this.sendMessage(phoneNumber, confirmationMessage);
            session.state = whatsapp_session_entity_1.SessionState.COMPLETED;
            session.reset();
        }
        catch (error) {
            this.logger.error('Error creating service request:', error);
            await this.sendMessage(phoneNumber, 'Sorry, there was an error creating your service request. Please try again or contact us directly.');
        }
    }
    getServiceTypeDisplay(serviceType) {
        switch (serviceType) {
            case request_type_enum_1.RequestType.OIL_CHANGE_SERVICE:
                return 'Oil Change/Service';
            case request_type_enum_1.RequestType.VEHICLE_BREAKDOWN:
                return 'Vehicle Breakdown';
            case request_type_enum_1.RequestType.WARRANTY_CLAIM:
                return 'Warranty Claim';
            case request_type_enum_1.RequestType.OTHER:
                return 'Other';
            default:
                return serviceType;
        }
    }
    async sendMessage(to, message) {
        if (!this.twilioClient) {
            this.logger.warn('Twilio client not initialized');
            return;
        }
        try {
            const from = this.configService.get('TWILIO_WHATSAPP_NUMBER');
            await this.twilioClient.messages.create({
                from: `whatsapp:${from}`,
                to,
                body: message,
            });
            this.logger.log(`Message sent to ${to}`);
        }
        catch (error) {
            this.logger.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
    async sendStatusUpdate(phoneNumber, ticketNumber, status, notes) {
        const message = `🔔 *Service Update*

🎫 *Ticket:* ${ticketNumber}
📊 *Status:* ${status}
${notes ? `📝 *Notes:* ${notes}` : ''}

Thank you for your patience!`;
        await this.sendMessage(`whatsapp:${phoneNumber}`, message);
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(whatsapp_session_entity_1.WhatsAppSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        service_requests_service_1.ServiceRequestsService,
        vehicles_service_1.VehiclesService,
        customers_service_1.CustomersService])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map