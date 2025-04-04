import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { TreeCanvas } from '../TreeCanvas';

const mockTree = {
  id: '1',
  title: 'Test Tree',
  theme: 'christmas',
  isPublic: true,
  ownerId: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
  },
  messages: [
    {
      id: 'msg1',
      content: 'Test message 1',
      treeId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const mockTreeWithoutMessages = {
  ...mockTree,
  messages: [],
};

describe('TreeCanvas', () => {
  it('renders tree with messages', () => {
    render(<TreeCanvas tree={mockTree} />);
    expect(screen.getByTitle('Test message 1')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(<TreeCanvas tree={mockTreeWithoutMessages} />);
    expect(screen.getByText(/No messages yet!/i)).toBeInTheDocument();
  });

  it('calls onAddMessage when add button is clicked', () => {
    const onAddMessage = jest.fn();
    render(<TreeCanvas tree={mockTreeWithoutMessages} onAddMessage={onAddMessage} />);

    const addButton = screen.getByRole('button', { name: /add message/i });
    fireEvent.click(addButton);

    expect(onAddMessage).toHaveBeenCalled();
  });

  it('applies theme-specific styles', () => {
    const { container } = render(<TreeCanvas tree={mockTree} />);
    const treeElement = container.firstChild as HTMLElement;
    expect(treeElement).toHaveStyle({ background: expect.stringContaining('blue.900') });
  });
});
