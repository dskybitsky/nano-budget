'use client';

import { DateTimePicker, DateTimePickerProps, DateStringValue, DateValue } from '@mantine/dates';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';

export interface DateTimePickerInputProps extends Omit<DateTimePickerProps, 'onChange'> {
  onChange?: (date: Date | null) => void;
}

export const DateTimePickerInput = ({ onChange, value, defaultValue, ...props }: DateTimePickerInputProps) => {
  const format = useCustomFormatter();

  const getLocalValue = (value: DateValue | undefined) => (
    !value || typeof value === 'string' ? value : format.dateTimeShort(value)
  );

  const handleChange = (date: DateStringValue | null) => {
    onChange?.(date ? new Date(date) : null);
  };

  return (
    <DateTimePicker
      onChange={handleChange}
      value={getLocalValue(value)}
      defaultValue={getLocalValue(defaultValue)}
      highlightToday={true}
      {...props}
    />
  );
};
