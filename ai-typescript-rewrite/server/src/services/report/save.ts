import type { DataAccess } from '../../data/access/index';
import type { ReportService } from './types';

export const createSave =
  (dataAccess: DataAccess): ReportService['save'] =>
  async (reportData, reportUploadId) => {
    if (reportData.length === 0) {
      return;
    }

    await dataAccess.saveReportData(
      reportData.map((row) => ({ ...row, report_upload_id: reportUploadId })),
    );
  };
