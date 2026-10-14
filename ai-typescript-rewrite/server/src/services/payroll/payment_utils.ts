import { endOfMonth, format, getDate, parseISO, setDate, startOfMonth } from 'date-fns';

/**
 * Returns the pay period label for a given date.
 *
 * Pay periods are roughly biweekly: the first half of a month is the 1st to
 * the 15th inclusive, and the second half is the 16th to the last day.
 * Expects an ISO `yyyy-MM-dd` date (the shape produced by `formatPayrollData`).
 */
export const findPayPeriod = (payrollDate: string): string => {
  const date = parseISO(payrollDate);
  const dayOfMonth = getDate(date);

  if (dayOfMonth <= 15) {
    const beginning = format(startOfMonth(date), 'd/MM/yyyy');
    const end = format(setDate(date, 15), 'd/MM/yyyy');
    return `${beginning} - ${end}`;
  }

  const beginning = format(setDate(date, 16), 'd/MM/yyyy');
  const end = format(endOfMonth(date), 'd/MM/yyyy');
  return `${beginning} - ${end}`;
};

// Exposed as an object so tests can spy on `findPayPeriod`.
export const paymentUtils = { findPayPeriod };

export default paymentUtils;
