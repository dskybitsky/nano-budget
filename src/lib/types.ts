export type ActualExpected = {
  actual: number,
  expected: number,
};

export type ActualExpectedPlanned = ActualExpected & { planned: number };

export type OffsetCount = { offset: number, count: number };

export type SearchParams = { [_: string]: string | undefined };
