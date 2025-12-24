import { PrismaClient, AccountType, Account, Category, Period, Transaction, OperationType } from '@prisma/client';

const prisma = new PrismaClient();

const accountsData: Omit<Account, 'id'>[] = [
  {
    name: 'Main',
    type: AccountType.checking,
    currency: 'CAD',
    value: 0,
    icon: '',
    order: 0,
  },
  {
    name: 'Secondary',
    type: AccountType.checking,
    currency: 'USD',
    value: 0,
    icon: '',
    order: 1,
  },
  {
    name: 'Savings',
    type: AccountType.savings,
    currency: 'CAD',
    value: 0,
    icon: '',
    order: 0,
  },
];

const categoriesData: Omit<Category, 'id' | 'accountId'>[][] = [
  /* Main Account */ [
    { name: 'Groceries', type: 'credit', icon: '🛒', order: 0 },
    { name: 'Bills & Utilities', type: 'credit', icon: '💡', order: 1 },
    { name: 'Entertainment', type: 'credit', icon: '🎮', order: 2 },
    { name: 'Transportation', type: 'credit', icon: '🚗', order: 3 },
    { name: 'Salary', type: 'debit', icon: '💰', order: 4 },
    { name: 'Investments', type: 'credit', icon: '📈', order: 5 },
  ],
  /* Secondary Account */ [
    { name: 'Treats', type: 'credit', icon: '🍦', order: 0 },
    { name: 'Misc', type: 'credit', icon: '🙂', order: 0 },
    { name: 'Top Up', type: 'debit', icon: '💰', order: 2 },
  ],
  /* Savings Account */ [
    { name: 'Deposit', type: 'debit', icon: '🏦', order: 0 },
    { name: 'Withdraw', type: 'credit', icon: '🏧', order: 2 },
  ],
];

const periodsData: Omit<Period, 'id' | 'accountId'>[][] = [
  /* Main Account */ [
    { name: 'January 2025', started: new Date('2025-01-01 00:00:00'), ended: new Date('2025-01-31 23:59:59') },
    { name: 'February 2025', started: new Date('2025-02-01 00:00:00'), ended: new Date('2025-02-28 23:59:59') },
    { name: 'March 2025', started: new Date('2025-03-01 00:00:00'), ended: null },
  ],
  /* Secondary Account */ [
    { name: 'February 2025', started: new Date('2025-02-01 00:00:00'), ended: new Date('2025-02-28 23:59:59') },
    { name: 'March 2025', started: new Date('2025-03-01 00:00:00'), ended: null },
  ],
  /* Savings Account */ [
    { name: 'March 2025', started: new Date('2025-03-01 00:00:00'), ended: null },
  ],
];

const transactionsData: Omit<Transaction, 'id' | 'categoryId'>[][][] = [
  /* Main Account */ [
    /* Groceries */ [
      {
        created: new Date('2025-01-03 14:21:30'),
        executed: new Date('2025-01-03 14:21:30'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 150.12,
      },
      {
        created: new Date('2025-01-10 13:01:12'),
        executed: new Date('2025-01-10 13:01:12'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 128.23,
      },
      {
        created: new Date('2025-01-17 15:46:51'),
        executed: new Date('2025-01-17 15:46:51'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 183.02,
      },
      {
        created: new Date('2025-01-24 12:59:11'),
        executed: new Date('2025-01-24 12:59:11'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 154.09,
      },
      {
        created: new Date('2025-01-30 18:00:09'),
        executed: new Date('2025-01-30 18:00:09'),
        name: 'Convenience Store',
        type: OperationType.credit,
        value: 82.15,
      },
      {
        created: new Date('2025-02-07 14:10:01'),
        executed: new Date('2025-02-07 14:10:01'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 211.43,
      },
      {
        created: new Date('2025-02-14 16:09:44'),
        executed: new Date('2025-02-14 16:09:44'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 170.12,
      },
      {
        created: new Date('2025-02-17 23:19:19'),
        executed: new Date('2025-02-17 23:19:19'),
        name: 'Convenience Store',
        type: OperationType.credit,
        value: 32.10,
      },
      {
        created: new Date('2025-02-20 13:46:23'),
        executed: new Date('2025-02-20 13:46:23'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 120.43,
      },
      {
        created: new Date('2025-02-28 15:01:00'),
        executed: new Date('2025-02-28 15:01:00'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 91.01,
      },
      {
        created: new Date('2025-03-07 13:55:32'),
        executed: new Date('2025-03-07 13:55:32'),
        name: 'Walmart',
        type: OperationType.credit,
        value: 135.33,
      },
    ],
    /* Bills & Utilities */ [
      {
        created: new Date('2025-01-01 09:14:03'),
        executed: new Date('2025-01-02 00:00:00'),
        name: 'Utilities',
        type: OperationType.credit,
        value: 256.22,
      },
      {
        created: new Date('2025-01-01 09:15:16'),
        executed: new Date('2025-01-01 09:15:16'),
        name: 'Cell Phone',
        type: OperationType.credit,
        value: 45.99,
      },
      {
        created: new Date('2025-02-01 09:11:07'),
        executed: new Date('2025-02-02 00:00:00'),
        name: 'Utilities',
        type: OperationType.credit,
        value: 239.21,
      },
      {
        created: new Date('2025-02-01 09:12:49'),
        executed: new Date('2025-02-01 09:12:49'),
        name: 'Cell Phone',
        type: OperationType.credit,
        value: 45.99,
      },
      {
        created: new Date('2025-03-01 09:31:50'),
        executed: new Date('2025-03-02 00:00:00'),
        name: 'Utilities',
        type: OperationType.credit,
        value: 248.98,
      },
      {
        created: new Date('2025-03-01 09:33:30'),
        executed: new Date('2025-03-01 09:33:30'),
        name: 'Cell Phone',
        type: OperationType.credit,
        value: 45.99,
      },
    ],
    /* Entertainment */ [
      {
        created: new Date('2025-01-12 18:55:23'),
        executed: new Date('2025-01-12 18:55:23'),
        name: 'Cineplex',
        type: OperationType.credit,
        value: 20.55,
      },
      {
        created: new Date('2025-02-09 16:01:59'),
        executed: new Date('2025-02-09 16:01:59'),
        name: 'Royal Museum',
        type: OperationType.credit,
        value: 32.00,
      },
    ],
    /* Transportation */ [
      {
        created: new Date('2025-01-04 10:21:12'),
        executed: new Date('2025-01-04 10:21:12'),
        name: 'Monthly pass',
        type: OperationType.credit,
        value: 98.80,
      },
      {
        created: new Date('2025-02-03 08:34:01'),
        executed: new Date('2025-02-03 08:34:01'),
        name: 'Monthly pass',
        type: OperationType.credit,
        value: 98.80,
      },
      {
        created: new Date('2025-02-18 23:02:56'),
        executed: new Date('2025-02-18 23:02:56'),
        name: 'Uber',
        type: OperationType.credit,
        value: 48.68,
      },
      {
        created: new Date('2025-03-03 10:29:32'),
        executed: new Date('2025-03-03 10:29:32'),
        name: 'Monthly pass',
        type: OperationType.credit,
        value: 98.80,
      },
    ],
    /* Salary */ [
      {
        created: new Date('2025-01-01 10:21:12'),
        executed: new Date('2025-01-01 00:00:00'),
        name: 'Salary',
        type: OperationType.debit,
        value: 1800.00,
      },
      {
        created: new Date('2025-02-01 09:43:21'),
        executed: new Date('2025-02-01 00:00:00'),
        name: 'Salary',
        type: OperationType.debit,
        value: 1800.00,
      },
      {
        created: new Date('2025-03-01 08:56:17'),
        executed: new Date('2025-03-01 00:00:00'),
        name: 'Salary',
        type: OperationType.debit,
        value: 1800.00,
      },
    ],
    /* Investments */ [
      {
        created: new Date('2025-03-09 19:42:08'),
        executed: null,
        name: 'Bitcoins',
        type: OperationType.credit,
        value: 800.00,
      },
    ],
  ],
  /* Secondary Account */ [
    /* Treats */ [
      {
        created: new Date('2025-02-23 18:01:50'),
        executed: new Date('2025-02-23 18:01:50'),
        name: 'Vodka',
        type: OperationType.credit,
        value: 45.22,
      },
      {
        created: new Date('2025-03-08 17:52:41'),
        executed: new Date('2025-03-08 17:52:41'),
        name: 'Champagne',
        type: OperationType.credit,
        value: 45.22,
      },
    ],
    /* Misc */ [
      {
        created: new Date('2025-02-15 05:02:49'),
        executed: new Date('2025-02-15 05:02:49'),
        name: 'Energy drink',
        type: OperationType.credit,
        value: 6.12,
      },
    ],
    /* Top Up */ [
      {
        created: new Date('2025-02-01 10:51:31'),
        executed: new Date('2025-02-01 10:51:31'),
        name: 'Top Up',
        type: OperationType.debit,
        value: 100.00,
      },
    ],
  ],
];

async function main() {
  await prisma.account.deleteMany({
    where: { name: { in: accountsData.map((a) => a.name) } },
  });

  const accounts = await Promise.all(
    accountsData.map((accountData) => prisma.account.create({ data: accountData })),
  );

  const categories = await Promise.all(
    categoriesData.map(async (accountCategoriesData, accountIndex) => await Promise.all(
      accountCategoriesData.map((accountCategoryData) =>
        prisma.category.create({
          data: { ...accountCategoryData, accountId: accounts[accountIndex].id },
        }),
      ),
    )),
  );

  const periods = await Promise.all(
    periodsData.map(async (accountPeriodsData, accountIndex) => await Promise.all(
      accountPeriodsData.map((accountPeriodData) =>
        prisma.period.create({
          data: { ...accountPeriodData, accountId: accounts[accountIndex].id },
        }),
      ),
    )),
  );

  const transactions = await Promise.all(
    transactionsData.map(async (accountTransactionsData, accountIndex) => await Promise.all(
      accountTransactionsData.map(async (accountCategoryTransactionsData, accountCategoryIndex) => Promise.all(
        accountCategoryTransactionsData.map(async (accountCategoryTransactionData) =>
          prisma.transaction.create({
            data: {
              ...accountCategoryTransactionData,
              categoryId: categories[accountIndex][accountCategoryIndex].id,
            },
          }),
        ),
      )),
    )),
  );

  console.log(JSON.stringify({ accounts, categories, periods, transactions }, null, 2));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
