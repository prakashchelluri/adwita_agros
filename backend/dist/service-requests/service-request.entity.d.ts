export declare enum RequestStatus {
    NEW = "new",
    AWAITING_APPROVAL = "awaiting_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress",
    PARTS_ORDERED = "parts_ordered",
    PARTS_RECEIVED = "parts_received",
    COMPLETED = "completed",
    CLOSED = "closed"
}
export declare enum RequestType {
    OIL_CHANGE_SERVICE = "oil_change_service",
    VEHICLE_BREAKDOWN = "vehicle_breakdown",
    WARRANTY_CLAIM = "warranty_claim",
    OTHER = "other"
}
export declare class ServiceRequest {
    id: number;
    ticketNumber: string;
    customer: any;
    vehicle: any;
    partsUsed: any[];
    type: RequestType;
    issueDescription: string;
    customerLocation: string;
    mediaUrls: string[];
    status: RequestStatus;
    isWarrantyEligible: boolean;
    manufacturerApprovalStatus: RequestStatus;
    manufacturerApprovalNotes: string;
    assignedTechnician: any;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
}
