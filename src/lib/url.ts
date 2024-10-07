import { TransactionFilter } from '@/lib/model/transaction';

export const createTransactionsPageUrl = (accountId: string, filter: TransactionFilter) => (
  `/${accountId}/transactions?`
  + `createdFrom=${filter.createdFrom?.toJSON() ?? ''}&`
  + `createdTo=${filter.createdTo?.toJSON() ?? ''}`
);
