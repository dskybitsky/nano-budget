import React from 'react';
import { Category } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CategoryImageProps extends React.HTMLAttributes<HTMLElement> {
    category: Category;
}

export const CategoryImage = ({ category, className }: CategoryImageProps) => {
    return (
        <Avatar className={cn(className, 'flex items-center justify-center space-y-0')}>
            <AvatarImage src={category.icon} alt="Category" />
            <AvatarFallback>{category.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
    );
};
