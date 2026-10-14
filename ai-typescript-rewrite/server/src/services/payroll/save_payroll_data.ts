import type { DataAccess } from '../../data/access/index';
import type { PayrollService } from './types';

/**
 * Persists the normalised timekeeping rows, attaching the owning report upload.
 */
export const createSavePayrollData =
  (dataAccess: DataAccess): PayrollService['savePayrollData'] =>
  async (payrollData, reportUploadId) => {
    if (payrollData.length === 0) {
      return;
    }

    await dataAccess.savePayrollData(
      payrollData.map((row) => ({ ...row, report_upload_id: reportUploadId })),
    );
  };
