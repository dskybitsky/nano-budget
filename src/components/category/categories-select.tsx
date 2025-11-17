import * as React from 'react';
import { useState } from 'react';
import { Category } from '@prisma/client';
import {
  Flex,
  Combobox,
  useCombobox,
  InputBase,
  Input,
  ScrollArea,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { EntityImageText } from '@/components/entity-image-text';
import { InputBaseProps } from '@mantine/core';
import _ from 'lodash';

export interface CategoriesSelectProps extends InputBaseProps {
  categories: Category[];
  defaultValue?: string|null;
  onChange?: (value: string | null) => void;
  onCategoryChange?: (category: Category | null) => void;
  placeholder?: string;
}

export const CategoriesSelect = ({
  categories,
  defaultValue,
  onChange,
  onCategoryChange,
  placeholder,
  ...props
}: CategoriesSelectProps) => {
  const categoriesIndex = _.keyBy(categories, 'id');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(defaultValue ?? null);
  const selectedOption = value ? categoriesIndex[value] : null;

  const options = categories.map((category) => (
    <Combobox.Option value={category.id} key={category.id}>
      <CategoryOption selected={selectedOption === category } category={category} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);

        if (onChange) {
          onChange(val);
        }

        if (onCategoryChange) {
          onCategoryChange(categoriesIndex[val]);
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
          {...props}
        >
          {selectedOption ? (
            <CategoryOption category={selectedOption} />
          ) : (
            <Flex align="center" justify="space-between" w="100%">
              <Input.Placeholder>{placeholder}</Input.Placeholder>
            </Flex>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

interface CategoryOptionProps {
  category: Category;
  selected?: boolean;
}

const CategoryOption = ({ category, selected }: CategoryOptionProps) => {
  return (
    <Flex gap="xs" align="center" justify="space-between" w="100%">
      <EntityImageText size={18} entity={category} />
      {selected && <IconCheck size={14} />}
    </Flex>
  );
};
