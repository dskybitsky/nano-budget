import { Card, CardBody } from '@nextui-org/react';
import React from 'react';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { BalanceIcon } from '@/components/icons/sidebar/balance-icon';
import { currencyRoundAbs } from '@/lib/utils';

interface SidebarBalanceCardProps {
    currency: string;
    balance: { expected: number; actual: number };
}

export const SidebarBalanceCard = ({ currency, balance: { expected, actual } }: SidebarBalanceCardProps) => {
    const format = useCustomFormatter();

    return (
        <Card className="xl:max-w-sm bg-default-600 rounded-xl shadow-md px-3 w-full">
            <CardBody className="py-5 overflow-hidden gap-y-1.5">
                <div className="flex items-center gap-x-1">
                    <BalanceIcon />
                    <span className="text-default text-s">Balance</span>
                </div>
                <div className="flex items-center">
                    <span className="text-default text-xl font-semibold">
                        {format.narrowCurrency(actual, currency)}
                    </span>
                </div>
                {currencyRoundAbs(actual - expected) > 0 && (
                    <div className="flex items-center">
                        <span className="text-default-300 text-s">{format.narrowCurrency(expected, currency)}</span>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
