import type { DataAccess } from '../../data/access/index';
import type { ReportService } from './types';

export const createGet =
  (dataAccess: DataAccess): ReportService['get'] =>
  async (reportId) => {
    const reportData = await dataAccess.getReportDataByReportId(reportId);

    return reportData.length === 0 ? null : reportData;
  };
