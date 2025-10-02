import { TransactionFilter } from '@/lib/model/transaction';

export const createAccountUrl = (accountId: string) => (
  `/${accountId}`
);

export const createTransactionsUrl = (accountId: string, filter?: TransactionFilter) => (
  `/${accountId}/transactions?`
  + `createdFrom=${filter?.createdFrom?.toJSON() ?? ''}&`
  + `createdTo=${filter?.createdTo?.toJSON() ?? ''}`
);

export const createBudgetUrl = (accountId: string, periodId?: string) => (
  `/${accountId}/budget?periodId=${periodId ?? ''}`
);
