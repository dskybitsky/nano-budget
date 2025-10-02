export const monetaryRound = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const monetaryEqual = (a: number, b: number): boolean => {
  return monetaryRound(a) === monetaryRound(b);
};
