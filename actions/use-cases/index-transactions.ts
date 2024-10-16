'use server';

import { Account, AccountType, Category, Period, Transaction, OperationType } from '@prisma/client';
import { getAccountCategories } from '@/actions/category';
import { getAccountTransactions } from '@/actions/transaction';
import { getAccountPeriods } from '@/actions/period';
import { getAccount } from '@/actions/account';
import { cookies } from 'next/headers';

export type TransactionsIndexDto =
    | {
          account: Account;
          periods: Period[];
          categories: Category[];
          period: Period;
          periodTransactions: (Transaction & { category: Category })[];
          periodTotal: { expected: number; actual: number };
      }
    | TransactionIndexAccountMissingErrorDto
    | TransactionIndexPeriodMissingErrorDto;

export type TransactionIndexAccountMissingErrorDto = {
    error: 'account-missing';
};

export type TransactionIndexPeriodMissingErrorDto = {
    error: 'period-missing';
    account: Account;
    periods: Period[];
    categories: Category[];
};

export const indexTransactions = async (): Promise<TransactionsIndexDto> => {
    const accountId = cookies().get('accountId')?.value;

    if (!accountId) {
        return { error: 'account-missing' };
    }

    const [account, periods, categories] = await Promise.all([
        getAccount(accountId),
        getAccountPeriods(accountId),
        getAccountCategories(accountId),
    ]);

    if (!account) {
        return { error: 'account-missing' };
    }

    const periodId = cookies().get(`${accountId}_periodId`)?.value;

    const period = periods.find((p) => p.id === periodId);

    if (!period) {
        return { error: 'period-missing', account, periods, categories };
    }

    const { started, ended } = period;

    const periodTransactions = await getAccountTransactions(accountId, started, ended);

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    const periodTotal = periodTransactions.reduce(
        (acc, transaction) => {
            const sign = transaction.type == OperationType.credit ? -1 : 1;

            acc.expected += accountSign * sign * transaction.value;

            if (transaction.executed) {
                acc.actual += accountSign * sign * transaction.value;
            }

            return acc;
        },
        { expected: 0, actual: 0 },
    );

    return { account, periods, categories, period, periodTransactions, periodTotal };
};
