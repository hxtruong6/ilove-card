import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SideBar from '../SideBar';

// Mock the color mode hook
jest.mock('@/components/ui/color-mode', () => ({
  useColorModeValue: jest.fn((light, dark) => light),
}));

describe('SideBar', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SideBar />);

    // Check for main elements
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('your')).toBeInTheDocument();
    expect(screen.getByText('Memories')).toBeInTheDocument();
    expect(screen.getByText('My tree')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Hi. Aidan')).toBeInTheDocument();
  });

  it('renders with custom user name', () => {
    render(<SideBar userName="John" />);
    expect(screen.getByText('Hi. John')).toBeInTheDocument();
  });

  it('calls onNavigate when menu items are clicked', () => {
    render(<SideBar onNavigate={mockOnNavigate} />);

    // Click on menu items
    fireEvent.click(screen.getByText('My tree'));
    expect(mockOnNavigate).toHaveBeenCalledWith('/trees');

    fireEvent.click(screen.getByText('Friends'));
    expect(mockOnNavigate).toHaveBeenCalledWith('/friends');

    fireEvent.click(screen.getByText('Settings'));
    expect(mockOnNavigate).toHaveBeenCalledWith('/settings');
  });

  it('calls onNavigate when user profile is clicked', () => {
    render(<SideBar onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByText('Hi. Aidan'));
    expect(mockOnNavigate).toHaveBeenCalledWith('/profile');
  });

  it('hides sidebar when isOpen is false', () => {
    render(<SideBar isOpen={false} />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveStyle({ width: '0px' });
  });

  it('shows sidebar when isOpen is true', () => {
    render(<SideBar isOpen={true} />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveStyle({ width: '280px' });
  });

  it('does not call onNavigate when no callback is provided', () => {
    render(<SideBar />);

    // Click on menu items - should not throw error
    fireEvent.click(screen.getByText('My tree'));
    fireEvent.click(screen.getByText('Friends'));
    fireEvent.click(screen.getByText('Settings'));

    // No errors should occur
    expect(true).toBe(true);
  });
});
