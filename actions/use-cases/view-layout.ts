import { Account, AccountType, Category, CategoryType, Period } from '@prisma/client';
import { getAccount, getAccounts } from '@/actions/account';
import { getAccountCategories } from '@/actions/category';
import { getAccountPeriods } from '@/actions/period';
import { getAccountTransactions } from '@/actions/transaction';

export interface LayoutViewDto {
    accounts: Account[];
    accountBalance?: { expected: number; actual: number };
}

export const viewLayout = async (id: string | undefined): Promise<LayoutViewDto> => {
    const accounts = await getAccounts();

    if (!id) {
        return { accounts };
    }

    const account = accounts.find((a) => a.id === id);

    if (!account) {
        return { accounts };
    }

    const transactions = await getAccountTransactions(id);

    let actual = account.value;
    let expected = account.value;

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    transactions.forEach((transaction) => {
        const sign = transaction.category.type === CategoryType.credit ? -1 : 1;

        if (transaction.executed) {
            actual += accountSign * sign * transaction.value;
        }
        expected += accountSign * sign * transaction.value;
    });

    return { accounts, accountBalance: { actual, expected } };
};
