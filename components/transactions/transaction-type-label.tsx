import React from 'react';
import { TransactionType } from '@prisma/client';

interface TransactionTypeLabelProps {
    type: TransactionType;
}

export const TransactionTypeLabel = ({ type }: TransactionTypeLabelProps) => {
    switch (type) {
        case TransactionType.credit:
            return <span>Credit</span>;
        case TransactionType.debit:
            return <span>Debit</span>;
    }
};
