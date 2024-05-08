import { VigencyUnits } from './enums.util';

export const getVigencyDates = (
  vigency: number,
  vigencyUnit: VigencyUnits,
): { startDate: Date; endDate: Date } => {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 0);

  switch (vigencyUnit) {
    case 'days':
      endDate.setDate(endDate.getDate() + vigency - 1);
      break;
    case 'months':
      endDate.setMonth(endDate.getMonth() + vigency);
      break;
    case 'years':
      endDate.setFullYear(endDate.getFullYear() + vigency);
      break;
  }

  return { startDate, endDate };
};
