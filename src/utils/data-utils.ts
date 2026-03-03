/**
 * Gets the current day of the month.
 */
const calculateCurrentMonthDay = (): number =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

/**
 * Subtracts hours from a date.
 * @param {Date} date - date to subtract from.
 * @param {number} hours - hours to subtract.
 * @returns Returns a new date with the hours subtracted.
 */
const subtractHours = (date: Date, hours: number): Date => {
  const dateCopy = new Date(date);

  dateCopy.setHours(dateCopy.getHours() - hours);

  return dateCopy;
};

/**
 * Formats the date for the API endpoint parameter format.
 * @param {Date} data -date to be formatted.
 * @returns returns a date string in YYYYMMDD format.
 */
const formatDateForQuery = (data: Date): string => {
  const year = data.getFullYear();
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const day = data.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

/**
 * Defines start and end dates given a month and year.
 * @param {number} month - month of the year.
 * @param {number} year - year.
 * @throws if the month of the year is in the future.
 * @returns returns an object containing startDate and endDate.
 */
const defineMonthStartAndEndDates = (
  month: number,
  year: number
): { startDate: Date; endDate: Date } => {
  const today = new Date();
  const isFuture = month > today.getMonth() + 1 && year >= today.getFullYear();

  if (isFuture) throw new Error("Não é possivel obter dados do futuro!");

  const startDate = new Date(year, month - 1, 1);

  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();

  const endDate = isCurrentMonth ? today : new Date(year, month, 0);

  return { startDate, endDate };
};

const formatDateWithUnderline = (date: Date | string | number): string => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return `${day}_${month}_${year}`;
};

const subtractDays = (daysBack: number): Date => {
  return new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
};

const addDays = (daysForward: number): Date => {
  return new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);
};

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default {
  calculateCurrentMonthDay,
  subtractHours,
  formatDateForQuery,
  defineMonthStartAndEndDates,
  formatDateWithUnderline,
  subtractDays,
  addDays,
  isToday,
};
