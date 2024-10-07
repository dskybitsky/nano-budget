'use client';

import { DateTimePicker, DateTimePickerProps } from '@mantine/dates';
import { DateStringValue } from '@mantine/dates/lib/types';
import { useLocale, useTimeZone } from 'next-intl';

export interface DateTimePickerInputProps extends Omit<DateTimePickerProps, 'onChange'> {
  onChange?: (date: Date | null) => void;
}

export const DateTimePickerInput = ({ onChange, value, defaultValue, ...props }: DateTimePickerInputProps) => {
  const timeZone = useTimeZone();
  const locale = useLocale();

  const localValue = value
    ? new Date(value).toLocaleString(locale, { timeZone })
    : undefined;

  const localDefaultValue = defaultValue
    ? new Date(defaultValue).toLocaleString(locale, { timeZone })
    : undefined;

  const handleChange = (date: DateStringValue | null) => {
    onChange?.(date ? new Date(date) : null);
  };

  return (
    <DateTimePicker
      onChange={handleChange}
      value={localValue}
      defaultValue={localDefaultValue}
      {...props}
    />
  );
};
