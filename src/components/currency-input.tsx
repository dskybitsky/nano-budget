import React from 'react';
import { TextInputProps, TextInput } from '@mantine/core';
import { monetaryRound } from '@/lib/utils';

export interface CurrencyInputProps extends Omit<TextInputProps, 'onChange'> {
  onChange?: (date: number) => void;
}

export const CurrencyInput = ({ onChange, ...props }: CurrencyInputProps) => {
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
      const evaluated = eval(e.currentTarget.value.replace(/,/g, '.'));

      if (evaluated != e.currentTarget.value) {
        const roundEvaluated = monetaryRound(parseFloat(evaluated)).toString(10);

        setInputValue(e.currentTarget, roundEvaluated);

        e.preventDefault();
      }
    } catch { /* empty */ }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(parseFloat(e.currentTarget.value.replace(/,/g, '.')));
    }
  };

  return (
    <TextInput
      onKeyDown={onKeyDownHandler}
      onChange={handleChange}
      pattern="[0-9\-+\.,]*"
      {...props}
    />
  );
};
