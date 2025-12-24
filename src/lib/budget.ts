import { AccountType, Budget, OperationType } from '@prisma/client';

export const calculateBudgetValue = (budget: Budget, categoryType: OperationType, accountType: AccountType): number => {
  const accountSign = accountType == AccountType.credit ? -1 : 1;
  const categorySign = categoryType == OperationType.credit ? -1 : 1;

  return accountSign * categorySign * budget.value;
};

export const calculateBudgetRest = (
  budget: Budget,
  expected: number,
  categoryType: OperationType,
  accountType: AccountType,
): number => {
  const accountSign = accountType == AccountType.credit ? -1 : 1;
  const categorySign = categoryType == OperationType.credit ? -1 : 1;

  return accountSign * categorySign < 0
    ? budget.value - Math.abs(expected)
    : Math.abs(expected)- budget.value;
};
