import { Account, AccountType, OperationType, Transaction } from '@prisma/client';
import { getAccounts } from '@/actions/account';
import { getAccountTransactions } from '@/actions/transaction';
import { WithBalance } from '@/types/balance';

export interface LayoutViewDto {
    accounts: WithBalance<Account>[];
}

export const viewLayout = async (): Promise<LayoutViewDto> => {
    const accounts = await getAccounts();
    const accountsTransactions = await Promise.all(accounts.map((a) => getAccountTransactions(a.id)));

    return {
        accounts: accounts.map((account, index) => ({
            ...account,
            balance: getBalance(account, accountsTransactions[index]),
        })),
    };
};

const getBalance = (account: Account, accountTransactions: Transaction[]): { expected: number; actual: number } => {
    let actual = account.value;
    let expected = account.value;

    const accountSign = account.type == AccountType.credit ? -1 : 1;

    accountTransactions.forEach((transaction) => {
        const sign = transaction.type === OperationType.credit ? -1 : 1;

        if (transaction.executed) {
            actual += accountSign * sign * transaction.value;
        }

        expected += accountSign * sign * transaction.value;
    });

    return { actual, expected };
};
