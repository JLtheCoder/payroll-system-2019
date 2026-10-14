import type { DataAccess } from '../../data/access/index';
import type { ReportService } from './types';

export const createList =
  (dataAccess: DataAccess): ReportService['list'] =>
  () =>
    dataAccess.listAllReports();
