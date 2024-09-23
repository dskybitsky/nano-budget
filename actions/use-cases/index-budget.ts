import { Account, AccountType, Budget, Category, CategoryType, Period } from '@prisma/client';
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
    periodTransactionSums?: Map<string, number>;
    periodTotal?: { planned: number; expected: number };
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
        acc.set(transaction.categoryId, transaction.value + (acc.get(transaction.categoryId) ?? 0));

        return acc;
    }, new Map<string, number>());

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
        acc.set(category.id, transactionsSumsIndex.get(category.id) ?? 0);
        return acc;
    }, new Map<string, number>());

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    const periodTotal = categories.reduce(
        (acc, category) => {
            const sign = category.type === CategoryType.debit ? 1 : -1;

            acc.planned += accountSign * sign * (periodBudgets.get(category.id)?.value ?? 0);
            acc.expected += accountSign * sign * (periodTransactionSums.get(category.id) ?? 0);

            return acc;
        },
        { planned: 0, expected: 0 },
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
