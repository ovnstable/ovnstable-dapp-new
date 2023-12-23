import dayjs from 'dayjs';

export const unixTsToDateStr = (timestamp: number, format = 'DD.MM.YYYY') => dayjs.unix(timestamp).format(format);

export const differenceInDays = (tsOne: number | string, tsTwo: number | string) => dayjs(tsOne).diff(tsTwo, 'day');

export const difference = (time1: number | string, time2: number | string) => {
  const date1 = dayjs(time1);
  const date2 = dayjs(time2);

  // eslint-disable-next-line no-nested-ternary
  return date1.isBefore(date2) ? 1 : date1.isAfter(date2) ? -1 : 0;
};

export const getUnixTsNow = (): any => dayjs().unix();
