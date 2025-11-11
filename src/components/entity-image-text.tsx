import React from 'react';
import { Flex } from '@mantine/core';
import { EntityImage, EntityImageProps } from '@/components/entity-image';

export const EntityImageText = (props: EntityImageProps) => {
  return (
    <Flex w="100%" justify="start" align="center" gap={10}>
      <EntityImage {...props} />
      {props.entity.name}
    </Flex>
  );
};
