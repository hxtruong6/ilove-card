import { LoginForm } from '@/components/auth/LoginForm';
import { fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';

// __tests__/components/auth/LoginForm.test.tsx
describe('LoginForm Accessibility', () => {
  test('form elements have proper ARIA labels', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
  });

  test('error messages are announced by screen readers', async () => {
    render(<LoginForm />);

    // Trigger an error
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Email is required');
  });
});
