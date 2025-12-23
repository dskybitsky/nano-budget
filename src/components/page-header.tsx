import React from 'react';
import { Flex, Title } from '@mantine/core';

interface PageHeaderProps  {
  title: string;
  leftSection?: React.ReactNode,
  rightSection?: React.ReactNode,
  bottomSection?: React.ReactNode,
}

export const PageHeader = ({
  title,
  leftSection,
  rightSection,
  bottomSection,
}: PageHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" w="100%" wrap="wrap" gap="md" mb="md">
      <Flex justify="start" align="center">
        {leftSection}
        <Title order={3}>{title}</Title>
      </Flex>
      {rightSection && (<Flex flex={1} w="100%" justify="end">
        {rightSection}
      </Flex>)}
      {bottomSection && (<Flex w="100%" justify="space-between" align="center">
        {bottomSection}
      </Flex>)}
    </Flex>
  );
};

