import { useFormatter } from 'next-intl';

export const useCustomFormatter = () => {
    const format = useFormatter();

    return {
        ...format,
        dateTimeShort: (value: Date | null | undefined, nullValue = ''): string => {
            return value ? format.dateTime(value, 'short') : nullValue;
        },
        narrowCurrency(value: number, currency: string): string {
            const roundValue = Math.abs(value) < 0.01 ? Math.abs(value) : value;
            return format.number(roundValue, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' });
        },
    };
};
