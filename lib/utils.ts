import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function currencyEq(value1: number, value2: number): boolean {
    return Math.abs(value1 - value2) < currencyEps;
}

export function currencyNeg(value: number): boolean {
    return value <= -1 * currencyEps;
}

export function currencyPos(value: number): boolean {
    return value >= currencyEps;
}

const currencyEps = 0.01;
