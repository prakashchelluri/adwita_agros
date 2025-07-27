import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminMetrics(): Promise<{
        weeklyTechnicianHours: {
            technicianName: any;
            totalHours: number;
        }[];
        customerComplaintsLast6Months: any[];
        overallTicketStatusCounts: any[];
    }>;
}
