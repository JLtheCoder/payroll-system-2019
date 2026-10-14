import { prisma } from '../prisma';
import type { JobGroup, ReportListItem, ReportRow } from '../../types/domain';

export interface PayrollDataCreate {
  report_upload_id: number;
  pay_date: string;
  hours_worked: number;
  employee_id: number;
  job_group: JobGroup;
}

export interface ReportDataCreate {
  report_upload_id: number;
  employee_id: number;
  pay_period: string;
  amount_paid: number;
}

export interface DataAccess {
  getReportDataByReportId(reportId: string): Promise<ReportRow[]>;
  saveReportUpload(reportId: string): Promise<{ id: number } | null>;
  savePayrollData(rows: PayrollDataCreate[]): Promise<void>;
  saveReportData(rows: ReportDataCreate[]): Promise<void>;
  listAllReports(): Promise<ReportListItem[]>;
}

/** Prisma reports unique-constraint violations with the code `P2002`. */
const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'P2002';

export const getReportDataByReportId = async (reportId: string): Promise<ReportRow[]> => {
  const rows = await prisma.reportData.findMany({
    where: { reportUpload: { csvReportId: reportId } },
    select: { employeeId: true, payPeriod: true, amountPaid: true },
    // Rows are inserted in report order (employee, then pay period).
    orderBy: { id: 'asc' },
  });

  return rows.map((row) => ({
    employee_id: row.employeeId,
    pay_period: row.payPeriod,
    amount_paid: row.amountPaid,
  }));
};

/**
 * Persists a new report id. Returns `null` when the id already exists so the
 * caller can turn it into a 409 response; any other failure is re-thrown.
 */
export const saveReportUpload = async (reportId: string): Promise<{ id: number } | null> => {
  try {
    return await prisma.reportUpload.create({
      data: { csvReportId: reportId },
      select: { id: true },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return null;
    }

    throw error;
  }
};

export const savePayrollData = async (rows: PayrollDataCreate[]): Promise<void> => {
  if (rows.length === 0) {
    return;
  }

  await prisma.payrollData.createMany({
    data: rows.map((row) => ({
      reportUploadId: row.report_upload_id,
      payDate: row.pay_date,
      hoursWorked: row.hours_worked,
      employeeId: row.employee_id,
      jobGroup: row.job_group,
    })),
  });
};

export const saveReportData = async (rows: ReportDataCreate[]): Promise<void> => {
  if (rows.length === 0) {
    return;
  }

  await prisma.reportData.createMany({
    data: rows.map((row) => ({
      reportUploadId: row.report_upload_id,
      employeeId: row.employee_id,
      payPeriod: row.pay_period,
      amountPaid: row.amount_paid,
    })),
  });
};

export const listAllReports = async (): Promise<ReportListItem[]> => {
  const uploads = await prisma.reportUpload.findMany({
    select: { csvReportId: true, createdDate: true },
    orderBy: { createdDate: 'asc' },
  });

  return uploads.map((upload) => ({
    report_id: upload.csvReportId,
    created_date: upload.createdDate,
  }));
};

export const dataAccess: DataAccess = {
  getReportDataByReportId,
  saveReportUpload,
  savePayrollData,
  saveReportData,
  listAllReports,
};
