import * as React from 'react';

import { Period } from '@prisma/client';
import { Button, Flex, Menu, Modal, Table, Text, UnstyledButton } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { PeriodForm, PeriodFormValues } from '@/components/period/period-form';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';

export interface PeriodsTableProps {
  periods: Period[];
  onCreateFormSubmit: (data: PeriodFormValues) => Promise<void>;
  onUpdateFormSubmit: (id: string, data: PeriodFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const PeriodsTable = ({
  periods,
  onCreateFormSubmit,
  onUpdateFormSubmit,
  onDeleteClick,
}: PeriodsTableProps) => {
  const t = useTranslations();
  const format = useCustomFormatter();

  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const handleCreateFormSubmit = async (formValues: PeriodFormValues) => {
    await onCreateFormSubmit(formValues);
    closeCreate();
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('Period.name')}</Table.Th>
          <Table.Th w="180">{t('Period.started')}</Table.Th>
          <Table.Th w="180">{t('Period.ended')}</Table.Th>
          <Table.Th w="50"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {periods.map((period) => (
          <Table.Tr key={period.id}>
            <Table.Td>{period.name}</Table.Td>
            <Table.Td>{format.dateTimeShort(period.started)}</Table.Td>
            <Table.Td>{format.dateTimeShort(period.ended, '')}</Table.Td>
            <Table.Td>
              <PeriodsTableActionCell
                period={period}
                onUpdateFormSubmit={onUpdateFormSubmit}
                onDeleteClick={onDeleteClick}
              />
            </Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td colSpan={4}>
            <Modal opened={createOpened} onClose={closeCreate} title={t('PeriodModal.createTitle')}>
              <PeriodForm onFormSubmit={handleCreateFormSubmit} />
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

const PeriodsTableActionCell = ({ period, onUpdateFormSubmit, onDeleteClick }: {
  period: Period,
  onUpdateFormSubmit: PeriodsTableProps['onUpdateFormSubmit'],
  onDeleteClick: PeriodsTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleUpdateFormSubmit = async (formValues: PeriodFormValues) => {
    await onUpdateFormSubmit(period.id, formValues);
    closeUpdate();
  };

  const modals = useModals();

  const handleDeleteClick = () => modals.openConfirmModal({
    title: t('PeriodModal.deleteTitle'),
    children: (
      <Text size="sm">
        {t('PeriodModal.deleteMessage')}
      </Text>
    ),
    labels: { confirm: t('Common.ok'), cancel: t('Common.cancel') },
    onConfirm: () => onDeleteClick(period.id),
  });

  const t = useTranslations();

  return (
    <>
      <Modal key={period.id} opened={updateOpened} onClose={closeUpdate} title={t('PeriodModal.editTitle')}>
        <PeriodForm
          period={period}
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
