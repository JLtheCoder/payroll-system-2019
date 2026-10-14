import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContext, resetDatabase, type TestContext } from './testDb';

const here = path.dirname(fileURLToPath(import.meta.url));
const sampleCsvPath = path.resolve(here, '..', '..', '..', 'sample.csv');

// A minimal, self-contained time report used by most tests. 10 hours at the
// job group A rate ($20) => $200 for employee 1.
const SMALL_CSV = [
  'date,hours worked,employee id,job group',
  '1/11/2016,10,1,A',
  'report id,43,,',
].join('\n');

describe('Payroll API (e2e)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    await resetDatabase(ctx.prisma);
  });

  afterAll(async () => {
    await ctx.prisma.$disconnect();
  });

  const uploadCsv = (csv: Buffer | string, filename = 'report.csv') =>
    request(ctx.app)
      .post('/api/payroll/report')
      .attach('csv', Buffer.isBuffer(csv) ? csv : Buffer.from(csv), filename);

  it('generates a report from an uploaded time report', async () => {
    const res = await uploadCsv(SMALL_CSV);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { employee_id: 1, pay_period: '1/11/2016 - 15/11/2016', amount_paid: 200 },
    ]);
  });

  it('archives the raw payroll rows', async () => {
    await uploadCsv(SMALL_CSV);

    const rows = await ctx.prisma.payrollData.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ employeeId: 1, hoursWorked: 10, jobGroup: 'A' });
  });

  it('rejects a duplicate report id with 409', async () => {
    await uploadCsv(SMALL_CSV);
    const res = await uploadCsv(SMALL_CSV);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/same report id/i);
  });

  it('lists uploaded reports', async () => {
    await uploadCsv(SMALL_CSV);

    const res = await request(ctx.app).get('/api/reports');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({ report_id: '43' });
  });

  it('returns a previously generated report', async () => {
    await uploadCsv(SMALL_CSV);

    const res = await request(ctx.app).get('/api/report/43');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { employee_id: 1, pay_period: '1/11/2016 - 15/11/2016', amount_paid: 200 },
    ]);
  });

  it('returns 404 for an unknown report', async () => {
    const res = await request(ctx.app).get('/api/report/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns 422 when no file is uploaded', async () => {
    const res = await request(ctx.app).post('/api/payroll/report');
    expect(res.status).toBe(422);
  });

  it('produces the documented report from the repo sample.csv', async () => {
    const res = await uploadCsv(await readFile(sampleCsvPath));

    expect(res.status).toBe(200);
    expect(res.body.data).toContainEqual({
      employee_id: 1,
      pay_period: '1/11/2016 - 15/11/2016',
      amount_paid: 150,
    });
  });
});
