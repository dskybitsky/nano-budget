import moment from 'moment/moment';

export const monetaryRound = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const monetaryEqual = (a: number, b: number): boolean => {
  return monetaryRound(a) === monetaryRound(b);
};

export const dateRound = (date: Date): Date => moment(date).startOf('day').toDate();

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};
