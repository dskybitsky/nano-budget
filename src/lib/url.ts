import { TransactionFilterDto } from '@/actions/transaction/transactions-index';

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

export const accountTransactionsIndexUrl = (
  accountId: string,
  periodId?: string,
  filter?: TransactionFilterDto,
) => (
  `/accounts/${accountId}/transactions?`
  + `periodId=${periodId ?? ''}&`
  + `executedFrom=${filter?.executedFrom?.toJSON() ?? ''}&`
  + `executedTo=${filter?.executedTo?.toJSON() ?? ''}`
);

export const accountBudgetIndexUrl = (accountId: string, periodId?: string) => (
  `/accounts/${accountId}/budget?periodId=${periodId ?? ''}`
);

export const settingsUrl = () => (
  '/settings'
);
