import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportTable } from './ReportTable';
import { getReport, getReportList } from '../services/payroll';
import type { ApiErrorBody, ReportListItem, ReportRow } from '../types';

export function Report() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [reportSelected, setReportSelected] = useState('');
  const [selectedReportData, setSelectedReportData] = useState<ReportRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getReportList()
      .then((result) => setReports(result.data.data))
      .catch(() => setError('Unable to load the list of reports.'));
  }, []);

  const onGetReportClick = async () => {
    if (!reportSelected) {
      return;
    }

    try {
      const result = await getReport(reportSelected);
      setError('');
      setSelectedReportData(result.data.data);
    } catch (err) {
      const message = axios.isAxiosError<ApiErrorBody>(err)
        ? (err.response?.data?.error ?? 'Unable to load the report.')
        : 'Unable to load the report.';
      setError(message);
    }
  };

  return (
    <section>
      <h1 className="text-lg font-semibold text-slate-900">Payroll Report</h1>

      <label htmlFor="report-select" className="mt-4 block text-sm font-medium text-slate-700">
        Report
      </label>
      <select
        id="report-select"
        value={reportSelected}
        onChange={(event) => setReportSelected(event.target.value)}
        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      >
        <option value="">Choose one of the reports</option>
        {reports.map((report) => (
          <option value={report.report_id} key={report.report_id}>
            {report.report_id}
          </option>
        ))}
      </select>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={onGetReportClick}
        disabled={!reportSelected}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Get Report
      </button>

      <ReportTable reportData={selectedReportData} />
    </section>
  );
}

export default Report;
