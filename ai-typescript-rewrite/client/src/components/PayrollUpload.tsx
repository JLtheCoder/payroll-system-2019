import { useRef, useState, type FormEvent } from 'react';
import axios from 'axios';
import { ReportTable } from './ReportTable';
import { uploadCsv } from '../services/payroll';
import type { ApiErrorBody, ReportRow } from '../types';

export function PayrollUpload() {
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<ReportRow[] | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const onSubmitUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const file = csvInputRef.current?.files?.[0];

    if (!file) {
      setError('Please choose a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const result = await uploadCsv(formData);
      setError('');
      setReportData(result.data.data);
    } catch (err) {
      const message = axios.isAxiosError<ApiErrorBody>(err)
        ? (err.response?.data?.error ?? 'Upload failed.')
        : 'Upload failed.';
      setError(message);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={onSubmitUpload}>
      <h1 className="text-lg font-semibold text-slate-900">Payroll Upload</h1>

      <div className="mt-4">
        <label htmlFor="csv" className="block text-sm font-medium text-slate-700">
          Payroll File
        </label>
        <input
          id="csv"
          type="file"
          accept=".csv"
          ref={csvInputRef}
          className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
        />
        <p className="mt-1 text-xs text-slate-500">Upload your payroll file in csv format.</p>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Submit
      </button>

      {error && (
        <div role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <ReportTable reportData={reportData} />
    </form>
  );
}

export default PayrollUpload;
