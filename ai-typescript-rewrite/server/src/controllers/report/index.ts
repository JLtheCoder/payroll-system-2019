import { reportService } from '../../services/report/index';
import { createGetReport } from './get_report';
import { createGetReportList } from './get_report_list';

export const reportController = {
  getReportList: createGetReportList(reportService),
  getReport: createGetReport(reportService),
};
