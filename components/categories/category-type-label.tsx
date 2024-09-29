import React from 'react';
import { CategoryType } from '@prisma/client';

interface CategoryTypeLabelProps {
    type: CategoryType;
}

export const CategoryTypeLabel = ({ type }: CategoryTypeLabelProps) => {
    switch (type) {
        case CategoryType.credit:
            return <span>Credit</span>;
        case CategoryType.debit:
            return <span>Debit</span>;
    }
};
