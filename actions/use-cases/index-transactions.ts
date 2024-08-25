import { Account, Category, Period, Transaction } from '@prisma/client';
import { getAccountCategories } from '@/actions/category';
import { getAccountTransactions } from '@/actions/transaction';
import { getAccountPeriods } from '@/actions/period';
import { getAccount } from '@/actions/account';

export interface TransactionsIndexDto {
    account: Account;
    periods: Period[];
    categories: Category[];
    period?: Period;
    periodTransactions?: Transaction[];
}

export const indexTransactions = async (accountId: string, periodId?: string): Promise<TransactionsIndexDto | null> => {
    const [account, periods, categories] = await Promise.all([
        getAccount(accountId),
        getAccountPeriods(accountId),
        getAccountCategories(accountId),
    ]);

    if (!account) {
        return null;
    }

    const period = periods.find((p) => p.id === periodId);

    if (!period) {
        return { account, periods, categories };
    }

    const { started, ended } = period;

    const periodTransactions = await getAccountTransactions(accountId, started, ended);

    return { account, periods, categories, period, periodTransactions };
};
