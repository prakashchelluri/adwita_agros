import { RequestType } from '../../common/enums/request-type.enum';
export declare class CreateServiceRequestDto {
    customerName: string;
    customerPhone: string;
    chassisNumber: string;
    type: RequestType;
    issueDescription: string;
    customerLocation?: string;
    mediaUrls?: string[];
}
