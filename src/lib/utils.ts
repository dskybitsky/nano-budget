import moment from 'moment/moment';
import { OffsetCount } from '@/lib/types';

export const monetaryRound = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const monetaryEqual = (a: number, b: number): boolean => {
  return monetaryRound(a) === monetaryRound(b);
};

export const dateRound = (date: Date): Date => moment(date).startOf('day').toDate();

export const dateRoundToNextWorkday = (date: Date): Date => {
  const momentDate = moment(date);
  const dayOfWeek = momentDate.day();

  if (dayOfWeek === 0) {
    return momentDate.add(1, 'days').startOf('day').toDate();
  }

  if (dayOfWeek === 6) {
    return momentDate.add(2, 'days').startOf('day').toDate();
  }

  return momentDate.startOf('day').toDate();
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};

export const pageToOffsetCount = (page: number, perPage: number): OffsetCount => ({
  offset: (page - 1) * perPage,
  count: perPage,
});

export const parseQueryDate = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

export const parseQueryPage = (value: unknown) => {
  const page = parseQueryNumber(value);

  return page !== undefined && page > 0 ? page : undefined;
};

export const parseQueryNumber = (value: unknown) => {
  const result = parseInt(value as string, 10);

  return isNaN(result) ? undefined : result;
};

export const parseQueryBoolean = (value: unknown) => {
  return value === 'true'
    ? true
    : (value === 'false' ? false : undefined);
};
