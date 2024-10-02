import * as React from 'react';
import { Input } from '@/components/ui/input';

export interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CurrencyInput = (props: CurrencyInputProps) => {
    const setInputValue = (input: HTMLInputElement, value: string) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;

        nativeInputValueSetter!.call(input, value);

        const event = new Event('input', { bubbles: true });

        input.dispatchEvent(event);
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            return;
        }

        const value = e.currentTarget.value;

        if (!value.match(/[0-9\-+]*/)) {
            return;
        }

        try {
            const evaluated = eval(e.currentTarget.value);

            if (evaluated != e.currentTarget.value) {
                setInputValue(e.currentTarget, evaluated);
                e.preventDefault();
            }
        } catch (e) {}
    };

    return <Input onKeyDown={onKeyDownHandler} {...props} pattern="[0-9\-+\.,]*" />;
};
