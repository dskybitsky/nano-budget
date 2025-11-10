import { TransactionFilter } from '@/lib/transaction';

export const homeUrl = () => (
  '/'
);

export const accountIndexUrl = () => (
  '/accounts'
);

export const accountCreateUrl = () => (
  '/accounts/create'
);

export const accountViewUrl = (accountId: string) => (
  `/accounts/${accountId}`
);

export const accountTransactionsIndexUrl = (accountId: string, filter?: TransactionFilter) => (
  `/accounts/${accountId}/transactions?`
  + `createdFrom=${filter?.createdFrom?.toJSON() ?? ''}&`
  + `createdTo=${filter?.createdTo?.toJSON() ?? ''}`
);

export const accountBudgetIndexUrl = (accountId: string, periodId?: string) => (
  `/accounts/${accountId}/budget?periodId=${periodId ?? ''}`
);

export const settingsUrl = () => (
  '/settings'
);
