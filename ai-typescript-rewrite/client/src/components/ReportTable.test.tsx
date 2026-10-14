import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReportTable } from './ReportTable';

describe('ReportTable', () => {
  it('renders a formatted row for each report entry', () => {
    render(
      <ReportTable
        reportData={[{ employee_id: 1, pay_period: '1/11/2016 - 15/11/2016', amount_paid: 300 }]}
      />,
    );

    expect(screen.getByText('Employee Id')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1/11/2016 - 15/11/2016')).toBeInTheDocument();
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });

  it('renders nothing when there is no report data', () => {
    const { container } = render(<ReportTable reportData={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
