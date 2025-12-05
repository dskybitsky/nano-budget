import { TransactionFilterDto } from '@/actions/transaction/transactions-index-all';

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

export const accountTransactionsAllIndexUrl = (
  accountId: string,
  filter?: TransactionFilterDto,
) => (
  `/accounts/${accountId}/transactions/all?`
  + `createdFrom=${filter?.createdFrom?.toJSON() ?? ''}&`
  + `createdTo=${filter?.createdTo?.toJSON() ?? ''}&`
  + `executed=${filter?.executed ?? ''}&`
  + `executedFrom=${filter?.executedFrom?.toJSON() ?? ''}&`
  + `executedTo=${filter?.executedTo?.toJSON() ?? ''}`
);

export const accountTransactionsPendingIndexUrl = (
  accountId: string,
) => (`/accounts/${accountId}/transactions/pending`);

export const accountTransactionsPeriodicIndexUrl = (
  accountId: string,
  periodId?: string,
) => (`/accounts/${accountId}/transactions/periodic?periodId=${periodId ?? ''}`);

export const accountBudgetIndexUrl = (accountId: string, periodId?: string) => (
  `/accounts/${accountId}/budget?periodId=${periodId ?? ''}`
);

export const settingsUrl = () => (
  '/settings'
);
