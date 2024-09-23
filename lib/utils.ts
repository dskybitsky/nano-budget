import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFormatter } from 'next-intl';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
