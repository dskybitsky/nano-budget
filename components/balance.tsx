import { formatCurrency } from '@/lib/utils';

interface BalanceProps {
    actual: number;
    expected: number;
    currency: string;
}

export const Balance = ({ actual, expected, currency }: BalanceProps) => {
    const actualCurrency = formatCurrency(actual, currency);
    const expectedCurrency = formatCurrency(expected, currency);

    return (
        <span className="text-nowrap">
            <span className="font-semibold">Balance:</span> {actualCurrency}{' '}
            <span className="text-slate-400">(→{expectedCurrency})</span>
        </span>
    );
};
