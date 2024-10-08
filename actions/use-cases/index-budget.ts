import { Account, AccountType, Budget, Category, Period, OperationType } from '@prisma/client';
import { getAccountCategories } from '@/actions/category';
import { getAccountTransactions } from '@/actions/transaction';
import { getPeriodBudget } from '@/actions/budget';
import { getAccountPeriods } from '@/actions/period';
import { getAccount } from '@/actions/account';

export interface BudgetIndexDto {
    account: Account;
    periods: Period[];
    categories: Category[];
    period?: Period;
    periodBudgets?: Map<string, Budget>;
    periodTransactionSums?: Map<string, { expected: number; actual: number }>;
    periodTotal?: { planned: number; expected: number; actual: number };
}

export const indexBudget = async (accountId: string, periodId?: string): Promise<BudgetIndexDto | null> => {
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

    const { id, started, ended } = period;

    const [transactions, budget] = await Promise.all([
        getAccountTransactions(accountId, started, ended),
        getPeriodBudget(id),
    ]);

    const budgetsIndex = budget.reduce((acc, budget) => {
        acc.set(budget.categoryId, budget);
        return acc;
    }, new Map<string, Budget>());

    const transactionsSumsIndex = transactions.reduce((acc, transaction) => {
        const { category, type, value } = transaction;

        const sign = type === category.type ? 1 : -1;

        let { expected, actual } = acc.get(category.id) ?? { expected: 0, actual: 0 };

        expected += sign * value;

        if (transaction.executed) {
            actual += sign * value;
        }

        acc.set(category.id, { expected, actual });
        return acc;
    }, new Map<string, { expected: number; actual: number }>());

    const periodBudgets = categories.reduce((acc, category) => {
        acc.set(
            category.id,
            budgetsIndex.get(category.id) ?? {
                categoryId: category.id,
                periodId: id,
                value: 0,
            },
        );
        return acc;
    }, new Map<string, Budget>());

    const periodTransactionSums = categories.reduce((acc, category) => {
        acc.set(category.id, transactionsSumsIndex.get(category.id) ?? { expected: 0, actual: 0 });
        return acc;
    }, new Map<string, { expected: number; actual: number }>());

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    const periodTotal = categories.reduce(
        (acc, category) => {
            const sign = category.type === OperationType.debit ? 1 : -1;

            acc.planned += accountSign * sign * (periodBudgets.get(category.id)?.value ?? 0);
            acc.expected += accountSign * sign * (periodTransactionSums.get(category.id)?.expected ?? 0);
            acc.actual += accountSign * sign * (periodTransactionSums.get(category.id)?.actual ?? 0);

            return acc;
        },
        { planned: 0, expected: 0, actual: 0 },
    );

    return {
        account,
        period,
        periods,
        categories,
        periodBudgets,
        periodTransactionSums,
        periodTotal,
    };
};
