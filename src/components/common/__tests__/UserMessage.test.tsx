import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import UserMessage from '../UserMessage';

// Mock the color mode hook
jest.mock('@/components/ui/color-mode', () => ({
  useColorModeValue: jest.fn((light, dark) => light),
}));

describe('UserMessage', () => {
  const defaultProps = {
    message: "Hi, you're the best person I've ever known in this world",
    author: 'Alex',
    timestamp: '12:03 - Sep 28, 2025',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<UserMessage {...defaultProps} />);

    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    expect(screen.getByText('by Alex')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.timestamp)).toBeInTheDocument();
  });

  it('renders with custom decoration', () => {
    render(<UserMessage {...defaultProps} decoration={{ type: 'pine' }} />);

    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
  });

  it('shows selection border when isSelected is true', () => {
    render(<UserMessage {...defaultProps} isSelected={true} />);

    const messageCard = screen.getByText(defaultProps.message).closest('div');
    expect(messageCard).toHaveStyle({ border: '2px solid' });
  });

  it('calls onMessageClick when message is clicked', () => {
    const mockOnClick = jest.fn();
    render(<UserMessage {...defaultProps} onMessageClick={mockOnClick} />);

    const messageCard = screen.getByText(defaultProps.message).closest('div');
    fireEvent.click(messageCard!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const mockOnMenuClick = jest.fn();
    render(<UserMessage {...defaultProps} onMenuClick={mockOnMenuClick} />);

    const menuButton = screen.getByLabelText('Message options');
    fireEvent.click(menuButton);
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('does not show menu button when onMenuClick is not provided', () => {
    render(<UserMessage {...defaultProps} />);

    expect(screen.queryByLabelText('Message options')).not.toBeInTheDocument();
  });

  it('renders different decoration types', () => {
    const decorations = ['holly', 'pine', 'berries', 'ribbon'] as const;

    decorations.forEach(decoration => {
      const { unmount } = render(
        <UserMessage {...defaultProps} decoration={{ type: decoration }} />
      );

      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with custom author name', () => {
    render(<UserMessage {...defaultProps} author="Sarah" />);

    expect(screen.getByText('by Sarah')).toBeInTheDocument();
  });

  it('renders with custom timestamp', () => {
    const customTimestamp = '15:30 - Dec 25, 2024';
    render(<UserMessage {...defaultProps} timestamp={customTimestamp} />);

    expect(screen.getByText(customTimestamp)).toBeInTheDocument();
  });

  it('prevents event propagation when menu is clicked', () => {
    const mockOnMenuClick = jest.fn();
    const mockOnMessageClick = jest.fn();

    render(
      <UserMessage
        {...defaultProps}
        onMenuClick={mockOnMenuClick}
        onMessageClick={mockOnMessageClick}
      />
    );

    const menuButton = screen.getByLabelText('Message options');
    fireEvent.click(menuButton);

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
    expect(mockOnMessageClick).not.toHaveBeenCalled();
  });

  it('applies correct cursor style when clickable', () => {
    const mockOnClick = jest.fn();
    render(<UserMessage {...defaultProps} onMessageClick={mockOnClick} />);

    const messageContainer = screen.getByText(defaultProps.message).closest('div');
    expect(messageContainer).toHaveStyle({ cursor: 'pointer' });
  });

  it('applies default cursor when not clickable', () => {
    render(<UserMessage {...defaultProps} />);

    const messageContainer = screen.getByText(defaultProps.message).closest('div');
    expect(messageContainer).toHaveStyle({ cursor: 'default' });
  });
});
