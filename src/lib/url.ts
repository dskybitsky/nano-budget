import { TransactionsFilter } from '@/lib/server/transaction';

export const homeUrl = () => (
  '/'
);

export const accountsIndexUrl = () => (
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
  filter?: TransactionsFilter,
  page?: number,
) => (
  `/accounts/${accountId}/transactions/all?`
  + (filter?.name ? `name=${filter.name}&` : '')
  + (filter?.categoryIdList ? filter.categoryIdList.map(c => `categoryId=${c}`).join('&') + '&' : '')
  + (filter?.createdFrom ? `createdFrom=${filter.createdFrom?.toJSON()}&` : '')
  + (filter?.createdTo ? `createdTo=${filter.createdTo?.toJSON()}&` : '')
  + (filter?.executedFrom ? `executedFrom=${filter.executedFrom?.toJSON()}&` : '')
  + (filter?.executedTo ? `executedTo=${filter.executedTo?.toJSON()}&` : '')
  + (page ? `page=${page}` : '')
);

export const accountTransactionsPendingIndexUrl = (
  accountId: string,
) => (`/accounts/${accountId}/transactions/pending`);

export const accountTransactionsPeriodIndexUrl = (
  accountId: string,
  periodId?: string,
) => (`/accounts/${accountId}/transactions/period?periodId=${periodId ?? ''}`);

export const accountBudgetIndexUrl = (accountId: string, periodId?: string) => (
  `/accounts/${accountId}/budget?periodId=${periodId ?? ''}`
);

export const settingsUrl = () => (
  '/settings'
);
