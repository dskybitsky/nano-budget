import React from 'react';
import { Box, BoxProps, Text } from '@mantine/core';
import { extractErrorMessage } from '@/lib/utils';

interface ErrorTextProps extends BoxProps {
  error: unknown
}

export const ErrorText = ({ error, ...props }: ErrorTextProps) => {
  return (
    <Box bg="red.0" {...props}>
      <Text c="red" size="sm">{extractErrorMessage(error)}</Text>
    </Box>
  );
};

