import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { TechnicianTimeLog } from '../time-logs/technician-time-log.entity';
import { ServiceRequest } from '../service-requests/service-request.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(TechnicianTimeLog)
    private readonly timeLogRepository: Repository<TechnicianTimeLog>,
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  async getAdminDashboardMetrics() {
    const weeklyTechnicianHours = await this.getWeeklyTechnicianHours();
    const customerComplaintsLast6Months =
      await this.getCustomerComplaintsLast6Months();
    const overallTicketStatusCounts = await this.getOverallTicketStatusCounts();

    return {
      weeklyTechnicianHours,
      customerComplaintsLast6Months,
      overallTicketStatusCounts,
    };
  }

  private async getWeeklyTechnicianHours() {
    const today = new Date();
    // Assuming week starts on Monday
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const result = await this.timeLogRepository
      .createQueryBuilder('timeLog')
      .select('technician.fullName', 'technicianName')
      .addSelect('SUM(timeLog.durationMinutes)', 'totalMinutes')
      .innerJoin('timeLog.technician', 'technician')
      .where('timeLog.startTime BETWEEN :weekStart AND :weekEnd', {
        weekStart,
        weekEnd,
      })
      .groupBy('technician.id')
      .orderBy('totalMinutes', 'DESC')
      .getRawMany();

    // Convert minutes to a more readable hour format
    return result.map((r) => ({
      technicianName: r.technicianName,
      totalHours: parseFloat((r.totalMinutes / 60).toFixed(2)),
    }));
  }

  private async getCustomerComplaintsLast6Months() {
    const sixMonthsAgo = subMonths(new Date(), 6);

    return this.serviceRequestRepository
      .createQueryBuilder('sr')
      .select('customer.fullName', 'customerName')
      .addSelect('COUNT(sr.id)', 'complaintCount')
      .innerJoin('sr.customer', 'customer')
      .where('sr.createdAt > :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('customer.id')
      .orderBy('complaintCount', 'DESC')
      .limit(10) // Get top 10 customers for a cleaner dashboard
      .getRawMany();
  }

  private async getOverallTicketStatusCounts() {
    return this.serviceRequestRepository
      .createQueryBuilder('sr')
      .select('sr.status', 'status')
      .addSelect('COUNT(sr.id)', 'count')
      .groupBy('sr.status')
      .getRawMany();
  }
}