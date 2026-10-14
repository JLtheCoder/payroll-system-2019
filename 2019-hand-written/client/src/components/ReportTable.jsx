import React from 'react';
import { Table } from 'reactstrap';

const ReportTable = ({ reportData }) => {
  if (!reportData) {
    return null;
  }

  const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  
  return (
    <Table>
      <thead>
        <tr>
          <th>Employee Id</th>
          <th>Pay Period</th>
          <th>Amount Paid</th>
        </tr>
      </thead>
      <tbody>
        {
          reportData.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value.employee_id}</td>
                <td>{value.pay_period}</td>
                <td>{dollarFormatter.format(value.amount_paid)}</td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
};

export default ReportTable;
