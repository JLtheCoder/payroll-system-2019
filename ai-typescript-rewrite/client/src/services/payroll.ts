import axios from 'axios';
import type { ApiResponse, ReportListItem, ReportRow } from '../types';

export function uploadCsv(formData: FormData) {
  return axios.post<ApiResponse<ReportRow[]>>('/api/payroll/report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getReportList() {
  return axios.get<ApiResponse<ReportListItem[]>>('/api/reports');
}

export function getReport(reportId: string) {
  return axios.get<ApiResponse<ReportRow[]>>(`/api/report/${reportId}`);
}
