export type ActualExpected = {
  actual: number,
  expected: number,
};

export type ActualExpectedPlanned = ActualExpected & { planned: number };

export type Pagination = { offset: number, count: number };
