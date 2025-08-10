import { ICON_PATH } from '@/lib/constants';
import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';
import { FiMail } from 'react-icons/fi';

import { ImageIcon } from './ImageIcon';

interface MessageIconProps {
  size?: number;
  useCustomIcon?: boolean;
  customIconPath?: string;
  color?: string;
  [key: string]: any;
}

/**
 * Message icon component that can use either react-icons or custom image paths
 * @param size - Size of the icon in pixels
 * @param useCustomIcon - Whether to use a custom image icon instead of react-icons
 * @param customIconPath - Custom path to the icon image (optional, defaults to ICON_PATH.MESSAGE)
 * @param props - Additional Chakra UI Icon props
 */
export const MessageIcon: React.FC<MessageIconProps> = ({
  size = 24,
  useCustomIcon = false,
  customIconPath,
  ...props
}) => {
  if (useCustomIcon) {
    return (
      <ImageIcon
        src={customIconPath || ICON_PATH.MESSAGE}
        alt="Message icon"
        size={size}
        fallbackSrc={ICON_PATH.MESSAGE_ALT}
        {...props}
      />
    );
  }

  return <Icon as={FiMail} boxSize={size} {...props} />;
};
