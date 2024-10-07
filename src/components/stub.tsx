import { Flex } from '@mantine/core';
import React from 'react';

export const Stub = ({ text }: { text?: string }) => {
  return (
    <Flex w="100%" h={200} align="center" justify="center">{text ?? 'Stub'}</Flex>
  );
};
