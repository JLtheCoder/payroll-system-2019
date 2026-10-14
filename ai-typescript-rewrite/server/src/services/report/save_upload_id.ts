import type { DataAccess } from '../../data/access/index';
import type { ReportService } from './types';

export const createSaveUploadId =
  (dataAccess: DataAccess): ReportService['saveUploadId'] =>
  (reportId) =>
    dataAccess.saveReportUpload(reportId);
