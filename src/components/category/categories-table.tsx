import * as React from 'react';

import { Category } from '@prisma/client';
import { Flex, Modal, Table, Text, ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { CategoryForm, CategoryFormValues } from '@/components/category/category-form';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { EntityImageText } from '@/components/entity-image-text';

export interface CategoriesTableProps {
  categories: Category[];
  onFormSubmit: (id: string, data: CategoryFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const CategoriesTable = ({
  categories,
  onFormSubmit,
  onDeleteClick,
}: CategoriesTableProps) => {

  const t = useTranslations();

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="20">{t('CategoriesTable.orderColumnHeader')}</Table.Th>
          <Table.Th>{t('Category.name')}</Table.Th>
          <Table.Th w="100">{t('Category.type')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {categories.map((category) => (
          <Table.Tr key={category.id}>
            <Table.Td>{category.order}</Table.Td>
            <Table.Td>
              <EntityImageText size={18} entity={category} />
            </Table.Td>
            <Table.Td>{t('Enum.OperationType', { value: category.type })}</Table.Td>
            <Table.Td ta="right">
              <CategoriesTableActionCell
                category={category}
                onFormSubmit={onFormSubmit}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const CategoriesTableActionCell = ({ category, onFormSubmit, onDeleteClick }: {
  category: Category,
  onFormSubmit: CategoriesTableProps['onFormSubmit'],
  onDeleteClick: CategoriesTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: CategoryFormValues) => {
    await onFormSubmit(category.id, formValues);
    closeUpdate();
  };

  const modals = useModals();

  const handleDeleteClick = () => modals.openConfirmModal({
    title: t('CategoryModal.deleteTitle'),
    children: (
      <Text size="sm">
        {t('CategoryModal.deleteMessage')}
      </Text>
    ),
    labels: { confirm: t('Common.ok'), cancel: t('Common.cancel') },
    onConfirm: () => onDeleteClick(category.id),
  });

  const t = useTranslations();

  return (
    <>
      <Modal key={category.id} opened={updateOpened} onClose={closeUpdate} title={t('CategoryModal.editTitle')}>
        <CategoryForm
          category={category}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
      <Flex justify="end">
        <ActionIcon variant="subtle" onClick={openUpdate}>
          <IconPencil size={14} />
        </ActionIcon>
        <ActionIcon variant="subtle" onClick={handleDeleteClick} color="red">
          <IconTrash size={14} />
        </ActionIcon>
      </Flex>
    </>
  );
};
