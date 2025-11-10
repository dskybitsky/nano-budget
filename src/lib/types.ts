export type Total = {
  actual: number,
  expected: number,
};

export type PlannedTotal = { planned: number } & Total;
