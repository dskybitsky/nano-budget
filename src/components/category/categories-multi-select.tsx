import * as React from 'react';
import { Category } from '@prisma/client';
import { Flex, MultiSelect, MultiSelectProps } from '@mantine/core';
import { EntityImageText } from '@/components/entity-image-text';
import { InputBaseProps } from '@mantine/core';
import _ from 'lodash';

export interface CategoriesMultiSelectProps extends InputBaseProps {
  categories: Category[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
}

export const CategoriesMultiSelect = ({
  categories,
  defaultValue,
  onChange,
  placeholder,
  ...props
}: CategoriesMultiSelectProps) => {
  const categoryIndex = _.keyBy(categories, 'id');

  const data = categories.map((category) => ({ value: category.id, label: category.name }));

  const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => {
    return (
      <Flex gap="xs" align="center" justify="space-between" w="100%">
        <EntityImageText size={18} entity={categoryIndex[option.value]} />
      </Flex>
    );
  };

  return (
    <MultiSelect
      data={data}
      defaultValue={defaultValue}
      placeholder={placeholder}
      renderOption={renderMultiSelectOption}
      onChange={onChange}
      hidePickedOptions
      {...props}
    />
  );
};
