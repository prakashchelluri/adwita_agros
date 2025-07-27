import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import { WhatsAppSession, SessionState } from './entities/whatsapp-session.entity';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CustomersService } from '../customers/customers.service';
import { RequestType } from '../common/enums/request-type.enum';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private twilioClient: twilio.Twilio;

  constructor(
    @InjectRepository(WhatsAppSession)
    private sessionRepository: Repository<WhatsAppSession>,
    private configService: ConfigService,
    private serviceRequestsService: ServiceRequestsService,
    private vehiclesService: VehiclesService,
    private customersService: CustomersService,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    } else {
      this.logger.warn('Twilio credentials not configured');
    }
  }

  async handleIncomingMessage(from: string, body: string, mediaUrls?: string[]): Promise<void> {
    try {
      // Clean phone number format
      const phoneNumber = from.replace('whatsapp:', '');
      
      // Get or create session
      let session = await this.sessionRepository.findOne({
        where: { phoneNumber },
      });

      if (!session) {
        session = this.sessionRepository.create({
          phoneNumber,
          state: SessionState.INITIAL,
        });
      }

      // Check if session is expired and reset if needed
      if (session.isExpired()) {
        session.reset();
      }

      // Update last message time
      session.lastMessageAt = new Date();

      // Process message based on current state
      await this.processMessage(session, body, mediaUrls);
      
      // Save session
      await this.sessionRepository.save(session);

    } catch (error) {
      this.logger.error('Error handling incoming message:', error);
      await this.sendMessage(from, 'Sorry, there was an error processing your message. Please try again.');
    }
  }

  private async processMessage(session: WhatsAppSession, body: string, mediaUrls?: string[]): Promise<void> {
    const phoneNumber = `whatsapp:${session.phoneNumber}`;

    switch (session.state) {
      case SessionState.INITIAL:
        await this.handleInitialMessage(session, phoneNumber);
        break;

      case SessionState.AWAITING_SERVICE_TYPE:
        await this.handleServiceTypeSelection(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_NAME:
        await this.handleNameInput(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_CHASSIS_NUMBER:
        await this.handleChassisNumberInput(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_CHASSIS_PHOTO:
        await this.handleChassisPhotoInput(session, mediaUrls, phoneNumber);
        break;

      case SessionState.AWAITING_LOCATION:
        await this.handleLocationInput(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_ALTERNATE_CONTACT:
        await this.handleAlternateContactInput(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_ISSUE_DESCRIPTION:
        await this.handleIssueDescriptionInput(session, body, phoneNumber);
        break;

      case SessionState.AWAITING_ISSUE_MEDIA:
        await this.handleIssueMediaInput(session, body, mediaUrls, phoneNumber);
        break;

      default:
        await this.sendMessage(phoneNumber, 'I didn\'t understand that. Type "start" to begin a new service request.');
    }
  }

  private async handleInitialMessage(session: WhatsAppSession, phoneNumber: string): Promise<void> {
    const welcomeMessage = `🔧 *Welcome to Adwita Agros!*

Thank you for contacting us. Please choose from the options below:

1️⃣ Oil Change/Service
2️⃣ Vehicle Breakdown
3️⃣ Warranty Claim
4️⃣ Other

Please reply with the number (1, 2, 3, or 4) of your choice.`;

    await this.sendMessage(phoneNumber, welcomeMessage);
    session.state = SessionState.AWAITING_SERVICE_TYPE;
  }

  private async handleServiceTypeSelection(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    const choice = body.trim();
    let serviceType: string;

    switch (choice) {
      case '1':
        serviceType = RequestType.OIL_CHANGE_SERVICE;
        break;
      case '2':
        serviceType = RequestType.VEHICLE_BREAKDOWN;
        break;
      case '3':
        serviceType = RequestType.WARRANTY_CLAIM;
        break;
      case '4':
        serviceType = RequestType.OTHER;
        break;
      default:
        await this.sendMessage(phoneNumber, 'Please select a valid option (1, 2, 3, or 4).');
        return;
    }

    session.serviceType = serviceType;
    session.state = SessionState.AWAITING_NAME;

    await this.sendMessage(phoneNumber, '👤 Please enter your full name:');
  }

  private async handleNameInput(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    if (!body.trim()) {
      await this.sendMessage(phoneNumber, 'Please enter a valid name.');
      return;
    }

    session.customerName = body.trim();
    session.state = SessionState.AWAITING_CHASSIS_NUMBER;

    await this.sendMessage(phoneNumber, '🔢 Please enter your vehicle chassis number (10 digits):');
  }

  private async handleChassisNumberInput(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    const chassisNumber = body.trim().toUpperCase();
    
    if (chassisNumber.length < 8) {
      await this.sendMessage(phoneNumber, 'Please enter a valid chassis number (at least 8 characters).');
      return;
    }

    session.chassisNumber = chassisNumber;
    session.state = SessionState.AWAITING_CHASSIS_PHOTO;

    await this.sendMessage(phoneNumber, '📸 Please send a photo of your vehicle chassis number plate (optional - you can type "skip" to continue):');
  }

  private async handleChassisPhotoInput(session: WhatsAppSession, mediaUrls: string[], phoneNumber: string): Promise<void> {
    if (mediaUrls && mediaUrls.length > 0) {
      session.chassisPhotoUrl = mediaUrls[0];
      await this.sendMessage(phoneNumber, '✅ Photo received! Thank you.');
    }

    // Move to next step regardless of photo
    if (session.serviceType === RequestType.WARRANTY_CLAIM) {
      // For warranty claims, we don't need location
      session.state = SessionState.AWAITING_ALTERNATE_CONTACT;
      await this.sendMessage(phoneNumber, '📞 Please enter your alternate contact number:');
    } else {
      session.state = SessionState.AWAITING_LOCATION;
      await this.sendMessage(phoneNumber, '📍 Please enter your vehicle current location:');
    }
  }

  private async handleLocationInput(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    session.customerLocation = body.trim();
    session.state = SessionState.AWAITING_ALTERNATE_CONTACT;

    await this.sendMessage(phoneNumber, '📞 Please enter your alternate contact number:');
  }

  private async handleAlternateContactInput(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    session.alternateContact = body.trim();
    session.state = SessionState.AWAITING_ISSUE_DESCRIPTION;

    await this.sendMessage(phoneNumber, '📝 Please describe the issue with your vehicle:');
  }

  private async handleIssueDescriptionInput(session: WhatsAppSession, body: string, phoneNumber: string): Promise<void> {
    session.issueDescription = body.trim();
    session.state = SessionState.AWAITING_ISSUE_MEDIA;

    await this.sendMessage(phoneNumber, '📸 Please send photos or videos of the issue (optional - type "done" when finished):');
  }

  private async handleIssueMediaInput(session: WhatsAppSession, body: string, mediaUrls: string[], phoneNumber: string): Promise<void> {
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
    } else {
      await this.sendMessage(phoneNumber, 'Please send media files or type "done" to complete your request.');
    }
  }

  private async createServiceRequest(session: WhatsAppSession, phoneNumber: string): Promise<void> {
    try {
      // Create or find customer
      let customer;
      try {
        customer = await this.customersService.findByPhone(session.phoneNumber);
      } catch {
        customer = await this.customersService.create({
          fullName: session.customerName,
          primaryPhone: session.phoneNumber,
          alternatePhones: session.alternateContact ? [session.alternateContact] : [],
          address: session.customerLocation,
        });
      }

      // Create or find vehicle
      let vehicle;
      try {
        vehicle = await this.vehiclesService.findOneByChassisNumber(session.chassisNumber);
      } catch {
        vehicle = await this.vehiclesService.create({
          chassisNumber: session.chassisNumber,
          customerId: customer.id,
          purchaseDate: new Date().toISOString(), // Default to today if not known
        });
      }

      // Check warranty status
      const warrantyStatus = await this.vehiclesService.checkWarrantyStatus(vehicle.id);

      // Create service request
      const serviceRequest = await this.serviceRequestsService.create({
        customerId: customer.id,
        vehicleId: vehicle.id,
        type: session.serviceType as RequestType,
        issueDescription: session.issueDescription,
        customerLocation: session.customerLocation,
        mediaUrls: session.issueMediaUrls || [],
        isWarrantyEligible: warrantyStatus.isUnderWarranty,
      });

      // Send confirmation message
      const confirmationMessage = `✅ *Service Request Created Successfully!*

🎫 *Ticket Number:* ${serviceRequest.ticketNumber}
🔧 *Service Type:* ${this.getServiceTypeDisplay(session.serviceType)}
🛡️ *Warranty Status:* ${warrantyStatus.isUnderWarranty ? '✅ Valid' : '❌ Expired'}

We have received your request and will contact you soon. Please save your ticket number for future reference.

Thank you for choosing Adwita Agros! 🚜`;

      await this.sendMessage(phoneNumber, confirmationMessage);

      // Reset session
      session.state = SessionState.COMPLETED;
      session.reset();

    } catch (error) {
      this.logger.error('Error creating service request:', error);
      await this.sendMessage(phoneNumber, 'Sorry, there was an error creating your service request. Please try again or contact us directly.');
    }
  }

  private getServiceTypeDisplay(serviceType: string): string {
    switch (serviceType) {
      case RequestType.OIL_CHANGE_SERVICE:
        return 'Oil Change/Service';
      case RequestType.VEHICLE_BREAKDOWN:
        return 'Vehicle Breakdown';
      case RequestType.WARRANTY_CLAIM:
        return 'Warranty Claim';
      case RequestType.OTHER:
        return 'Other';
      default:
        return serviceType;
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
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
    } catch (error) {
      this.logger.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendStatusUpdate(phoneNumber: string, ticketNumber: string, status: string, notes?: string): Promise<void> {
    const message = `🔔 *Service Update*

🎫 *Ticket:* ${ticketNumber}
📊 *Status:* ${status}
${notes ? `📝 *Notes:* ${notes}` : ''}

Thank you for your patience!`;

    await this.sendMessage(`whatsapp:${phoneNumber}`, message);
  }
}