export type Balance = {
    expected: number;
    actual: number;
};

export type WithBalance<T extends object> = T & { balance: Balance };
