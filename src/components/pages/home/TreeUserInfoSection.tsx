import React from 'react';

import { ImageIconExample } from './ImageIcon.example';
import { TreeUserInfo } from './TreeUserInfo';

/**
 * Example usage of TreeUserInfo component
 */
export const TreeUserInfoSection: React.FC = () => {
  const sampleData = {
    treeName: 'My 2025 Birthday Tree',
    user: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    messageInfo: [
      {
        id: '1',
        content: 'Happy Birthday! 🎉',
        createdAt: new Date('2025-01-15T10:00:00Z'),
      },
      {
        id: '2',
        content: 'Wishing you a wonderful year ahead!',
        createdAt: new Date('2025-01-15T11:30:00Z'),
      },
      {
        id: '3',
        content: 'May all your dreams come true! ✨',
        createdAt: new Date('2025-01-15T14:20:00Z'),
      },
    ],
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <TreeUserInfo
        treeName={sampleData.treeName}
        user={sampleData.user}
        messageInfo={sampleData.messageInfo}
      />

      {/* <div style={{ marginTop: '40px' }}>
        <ImageIconExample />
      </div> */}
    </div>
  );
};

export default TreeUserInfoSection;
