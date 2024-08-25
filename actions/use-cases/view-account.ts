import { Account, Category, Period } from '@prisma/client';
import { getAccount } from '@/actions/account';
import { getAccountCategories } from '@/actions/category';
import { getAccountPeriods } from '@/actions/period';

export interface AccountViewDto {
    account: Account;
    periods: Period[];
    categories: Category[];
}

export const viewAccount = async (id: string): Promise<AccountViewDto | null> => {
    const account = await getAccount(id);

    if (!account) {
        return null;
    }

    const [periods, categories] = await Promise.all([getAccountPeriods(id), getAccountCategories(id)]);

    return { account, periods, categories };
};
