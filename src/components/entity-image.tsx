import React from 'react';
import { Avatar, AvatarProps } from '@mantine/core';

export interface EntityImageProps extends AvatarProps {
  entity: { icon: string; name: string };
}

export const EntityImage = ({ entity, ...props }: EntityImageProps) => {
  const iconUrl = parseAsUrl(entity.icon);
  const iconEmoji = parseAsEmoji(entity.icon);

  return (
    <Avatar src={iconUrl} alt={entity.name} {...props}>
      {iconEmoji ?? entity.name.substring(0, 2)}
    </Avatar>
  );
};

const parseAsUrl = (icon: string) => (
  icon.length > 4 && (
    icon.startsWith('http')
      || icon.startsWith('data')
      || icon.startsWith('//')
  )
    ? icon
    : null
);

const parseAsEmoji = (icon: string) => (
  icon.length > 0 || icon.length <= 2
    ? icon
    : null
);
