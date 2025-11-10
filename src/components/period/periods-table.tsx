import * as React from 'react';

import { Period } from '@prisma/client';
import { ActionIcon, Flex, Modal, Table, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useCustomFormatter } from '@/hooks/use-custom-formatter';
import { PeriodForm, PeriodFormValues } from '@/components/period/period-form';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export interface PeriodsTableProps {
  periods: Period[];
  onFormSubmit: (id: string, data: PeriodFormValues) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
}

export const PeriodsTable = ({
  periods,
  onFormSubmit,
  onDeleteClick,
}: PeriodsTableProps) => {
  const t = useTranslations();
  const format = useCustomFormatter();

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

const PeriodsTableActionCell = ({ period, onFormSubmit, onDeleteClick }: {
  period: Period,
  onFormSubmit: PeriodsTableProps['onFormSubmit'],
  onDeleteClick: PeriodsTableProps['onDeleteClick'],
}) => {
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const handleFormSubmit = async (formValues: PeriodFormValues) => {
    await onFormSubmit(period.id, formValues);
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
