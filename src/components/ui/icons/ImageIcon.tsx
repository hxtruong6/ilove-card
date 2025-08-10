import { Box, BoxProps } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface ImageIconProps extends Omit<BoxProps, 'as'> {
  src: string;
  alt?: string;
  size?: number | string;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Flexible icon component that can display images from various formats (PNG, JPG, SVG)
 * @param src - Path URL to the image file
 * @param alt - Alt text for accessibility
 * @param size - Size of the icon (number for pixels, string for other units)
 * @param fallbackSrc - Fallback image URL if the main image fails to load
 * @param objectFit - How the image should fit within the container
 * @param props - Additional Chakra UI Box props
 */
export const ImageIcon: React.FC<ImageIconProps> = ({
  src,
  alt = 'Icon',
  size = 24,
  fallbackSrc,
  objectFit = 'contain',
  ...props
}) => {
  const isSvg = src.toLowerCase().endsWith('.svg');
  const iconSize = typeof size === 'number' ? `${size}px` : size;

  // For SVG files, we can use them as background images or inline
  if (isSvg) {
    return (
      <Box
        w={iconSize}
        h={iconSize}
        bgImage={`url('${src}')`}
        bgSize={objectFit}
        bgRepeat="no-repeat"
        position="relative"
        {...props}
      />
    );
  }

  // For other image formats, use Next.js Image component
  return (
    <Box w={iconSize} h={iconSize} position="relative" display="inline-block" {...props}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit,
        }}
        onError={e => {
          if (fallbackSrc) {
            const target = e.target as HTMLImageElement;
            target.src = fallbackSrc;
          }
        }}
      />
    </Box>
  );
};

export default ImageIcon;
