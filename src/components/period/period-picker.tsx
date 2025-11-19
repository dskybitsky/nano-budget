import { Period } from '@prisma/client';
import { Pagination, Text } from '@mantine/core';

import classes from './period-picker.module.css';

export interface PeriodPickerProps {
  periods: Period[];
  periodId?: string,
  onChange?: (period: Period) => void;
}

export const PeriodPicker = ({ periods, periodId, onChange }: PeriodPickerProps) => {
  const totalPages = periods.length;
  const currentPage = periodId ? periods.findIndex(p => p.id === periodId) + 1 : undefined;

  const handleChange = (page: number) => onChange?.(periods[page - 1]);

  return (
    <Pagination
      total={totalPages}
      value={currentPage}
      withEdges={true}
      withControls={false}
      onChange={handleChange}
      getItemProps={(page) => {
        const isCurrentPage = page === currentPage;
        const bg = isCurrentPage ? 'gray.2' : '';
        const fw = isCurrentPage ? 'bold' : '';

        return ({
          component: 'a',
          children: (
            <Text px={20} py={10} fz={14} bg={bg} fw={fw} className={classes.linkText}>
              {periods[page - 1].name}
            </Text>
          ),
        });
      }}
      siblings={1}
      boundaries={0}
      classNames={{
        root: classes.root,
        control: classes.control,
      }}
    />
  );
};
