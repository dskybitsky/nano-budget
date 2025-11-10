import { TransactionFilter } from '@/lib/transaction';

export const homeUrl = () => (
  '/'
);

export const accountCreateUrl = () => (
  '/create'
);

export const accountIndexUrl = () => (
  '/accounts'
);

export const accountViewUrl = (accountId: string) => (
  `/${accountId}`
);

export const accountTransactionsIndexUrl = (accountId: string, filter?: TransactionFilter) => (
  `/${accountId}/transactions?`
  + `createdFrom=${filter?.createdFrom?.toJSON() ?? ''}&`
  + `createdTo=${filter?.createdTo?.toJSON() ?? ''}`
);

export const accountBudgetIndexUrl = (accountId: string, periodId?: string) => (
  `/${accountId}/budget?periodId=${periodId ?? ''}`
);

export const settingsUrl = () => (
  '/settings'
);
