import * as React from 'react';

import { Category } from '@prisma/client';
import { Button, Flex, Menu, Modal, Table, UnstyledButton, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { CategoryForm, CategoryFormValues } from '@/components/category/category-form';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';

export interface CategoriesTableProps {
  categories: Category[];
  onCreateFormSubmit: (data: CategoryFormValues) => Promise<void>;
  onUpdateFormSubmit: (id: string, data: CategoryFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const CategoriesTable = ({
  categories,
  onCreateFormSubmit,
  onUpdateFormSubmit,
  onDeleteClick,
}: CategoriesTableProps) => {
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const handleCreateFormSubmit = async (formValues: CategoryFormValues) => {
    await onCreateFormSubmit(formValues);
    closeCreate();
  };

  const t = useTranslations();

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="60%">{t('Category.name')}</Table.Th>
          <Table.Th>{t('Category.type')}</Table.Th>
          <Table.Th w="100">{t('Category.order')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {categories.map((category) => (
          <Table.Tr key={category.id}>
            <Table.Td>{category.name}</Table.Td>
            <Table.Td>{t('Enum.OperationType', { value: category.type })}</Table.Td>
            <Table.Td>{category.order}</Table.Td>
            <Table.Td>
              <CategoriesTableActionCell
                category={category}
                onUpdateFormSubmit={onUpdateFormSubmit}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td colSpan={4}>
            <Modal opened={createOpened} onClose={closeCreate} title={t('CategoryModal.createTitle')}>
              <CategoryForm onFormSubmit={handleCreateFormSubmit} />
            </Modal>
            <Flex justify="end">
              <Button leftSection={<IconPlus size={14} />} variant="subtle" size="xs" onClick={openCreate} >
                {t('Common.add')}
              </Button>
            </Flex>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

const CategoriesTableActionCell = ({ category, onUpdateFormSubmit, onDeleteClick }: {
  category: Category,
  onUpdateFormSubmit: CategoriesTableProps['onUpdateFormSubmit'],
  onDeleteClick: CategoriesTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleUpdateFormSubmit = async (formValues: CategoryFormValues) => {
    await onUpdateFormSubmit(category.id, formValues);
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
          onFormSubmit={handleUpdateFormSubmit}
        />
      </Modal>
      <Menu shadow="md">
        <Menu.Target>
          <UnstyledButton w="100%">
            <IconDotsVertical size={14} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{t('Common.actions')}</Menu.Label>
          <Menu.Item leftSection={ <IconPencil size={14} /> } onClick={openUpdate}>
            {t('Common.edit')}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={ <IconTrash size={14} /> } onClick={handleDeleteClick} color="red">
            {t('Common.delete')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
