import { useCustomFormatter } from '@/hooks/use-custom-formatter';

interface BalanceProps {
    actual: number;
    expected: number;
    currency: string;
}

export const Balance = ({ actual, expected, currency }: BalanceProps) => {
    const format = useCustomFormatter();

    const actualCurrency = format.narrowCurrency(actual, currency);
    const expectedCurrency = format.narrowCurrency(expected, currency);

    return (
        <span className="text-nowrap">
            <span className="font-semibold">Balance:</span> {actualCurrency}{' '}
            <span className="text-slate-400">(→{expectedCurrency})</span>
        </span>
    );
};
