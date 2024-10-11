import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function currencyRound(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function currencyRoundAbs(value: number): number {
    return Math.abs(currencyRound(value));
}
