import type { ReportRow } from '../types';

interface ReportTableProps {
  /** Report rows to display, or `null` when no report has been loaded yet. */
  reportData: ReportRow[] | null;
}

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function ReportTable({ reportData }: ReportTableProps) {
  if (!reportData) {
    return null;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 font-semibold text-slate-700">Employee Id</th>
            <th className="px-4 py-2 font-semibold text-slate-700">Pay Period</th>
            <th className="px-4 py-2 font-semibold text-slate-700">Amount Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reportData.map((value) => (
            <tr key={`${value.employee_id}-${value.pay_period}`}>
              <td className="px-4 py-2 text-slate-600">{value.employee_id}</td>
              <td className="px-4 py-2 text-slate-600">{value.pay_period}</td>
              <td className="px-4 py-2 text-slate-600">
                {dollarFormatter.format(value.amount_paid)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
