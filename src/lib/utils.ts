import { customAlphabet } from 'nanoid';

// Create a URL-friendly nanoid generator
const generateShareId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

/**
 * Generates a unique share URL for a tree
 * @param treeId - The ID of the tree to share
 * @returns A unique share URL
 */
export function generateShareUrl(treeId: string): string {
  const shareId = generateShareId();
  return `/share/${shareId}/${treeId}`;
}

/**
 * Extracts the tree ID from a share URL
 * @param shareUrl - The share URL to parse
 * @returns The tree ID if valid, null otherwise
 */
export function parseShareUrl(shareUrl: string): string | null {
  const match = shareUrl.match(/\/share\/[^/]+\/([^/]+)/);
  return match ? match[1] : null;
}
