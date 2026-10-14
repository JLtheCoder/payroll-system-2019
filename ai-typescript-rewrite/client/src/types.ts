export interface ReportRow {
  employee_id: number;
  pay_period: string;
  amount_paid: number;
}

export interface ReportListItem {
  report_id: string;
  created_date: string;
}

/** Envelope used by the API for successful responses. */
export interface ApiResponse<T> {
  data: T;
}

/** Envelope used by the API for error responses. */
export interface ApiErrorBody {
  error: string;
  status: number;
}
