import type { ReportListItem, ReportRow } from '../../types/domain';

export interface ReportService {
  /** Records a new report id; returns `null` when it already exists. */
  saveUploadId(reportId: string): Promise<{ id: number } | null>;
  /** Persists the generated report rows for a given upload. */
  save(reportData: ReportRow[], reportUploadId: number): Promise<void>;
  /** Loads a previously generated report, or `null` when it does not exist. */
  get(reportId: string): Promise<ReportRow[] | null>;
  /** Lists every uploaded report. */
  list(): Promise<ReportListItem[]>;
}
