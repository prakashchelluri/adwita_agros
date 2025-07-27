export declare enum SessionState {
    INITIAL = "initial",
    AWAITING_SERVICE_TYPE = "awaiting_service_type",
    AWAITING_NAME = "awaiting_name",
    AWAITING_CHASSIS_NUMBER = "awaiting_chassis_number",
    AWAITING_CHASSIS_PHOTO = "awaiting_chassis_photo",
    AWAITING_LOCATION = "awaiting_location",
    AWAITING_ALTERNATE_CONTACT = "awaiting_alternate_contact",
    AWAITING_ISSUE_DESCRIPTION = "awaiting_issue_description",
    AWAITING_ISSUE_MEDIA = "awaiting_issue_media",
    COMPLETED = "completed"
}
export declare class WhatsAppSession {
    id: number;
    phoneNumber: string;
    state: SessionState;
    serviceType: string;
    customerName: string;
    chassisNumber: string;
    chassisPhotoUrl: string;
    customerLocation: string;
    alternateContact: string;
    issueDescription: string;
    issueMediaUrls: string[];
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
    isExpired(): boolean;
    reset(): void;
}
