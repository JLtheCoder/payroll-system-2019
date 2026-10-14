import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const sampleCsvPath = path.resolve(here, '..', '..', 'sample.csv');

let counter = 0;

/** A unique report id per test so tests never collide in the shared database. */
function uniqueReportId(): string {
  counter += 1;
  return `e2e-${Date.now()}-${counter}`;
}

/** 10 hours at the job group A rate ($20) => $200 for employee 1. */
function timeReportCsv(reportId: string): string {
  return [
    'date,hours worked,employee id,job group',
    '1/11/2016,10,1,A',
    `report id,${reportId},,`,
  ].join('\n');
}

async function uploadCsv(page: Page, csv: string, filename: string): Promise<void> {
  await page.goto('/');
  await page.setInputFiles('#csv', {
    name: filename,
    mimeType: 'text/csv',
    buffer: Buffer.from(csv),
  });
  await page.getByRole('button', { name: 'Submit' }).click();
}

test.describe('Payroll end-to-end', () => {
  test('uploads a time report and renders the payroll report', async ({ page }) => {
    await uploadCsv(page, timeReportCsv(uniqueReportId()), 'report.csv');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Employee Id' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Pay Period' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Amount Paid' })).toBeVisible();
    await expect(table).toContainText('1/11/2016 - 15/11/2016');
    await expect(table).toContainText('$200.00');
  });

  test('rejects a second upload with the same report id', async ({ page }) => {
    const reportId = uniqueReportId();
    await uploadCsv(page, timeReportCsv(reportId), 'report.csv');
    await expect(page.getByRole('table')).toBeVisible();

    await uploadCsv(page, timeReportCsv(reportId), 'report.csv');
    await expect(page.getByRole('alert')).toContainText('same report id');
  });

  test('lists an uploaded report and loads it from the report page', async ({ page }) => {
    const reportId = uniqueReportId();
    await uploadCsv(page, timeReportCsv(reportId), 'report.csv');

    await page.getByRole('link', { name: 'Payroll Report' }).click();
    await page.getByLabel('Report').selectOption(reportId);
    await page.getByRole('button', { name: 'Get Report' }).click();

    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table).toContainText('1/11/2016 - 15/11/2016');
    await expect(table).toContainText('$200.00');
  });

  test('renders the documented report for the bundled sample.csv', async ({ page }) => {
    await uploadCsv(page, readFileSync(sampleCsvPath).toString(), 'sample.csv');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table).toContainText('1/11/2016 - 15/11/2016');
    await expect(table).toContainText('$150.00');
  });
});
