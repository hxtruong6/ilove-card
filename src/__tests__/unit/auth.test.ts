import { hashPassword, validateEmail, validatePassword, verifyPassword } from '@/lib/auth';

describe('Auth Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt format
    });

    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword('wrongPassword', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate correct password formats', () => {
      const validPasswords = ['Password123', 'StrongP@ss1', 'SecurePass123'];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should reject invalid password formats', () => {
      const invalidPasswords = [
        'short1', // too short
        'onlylowercase123', // no uppercase
        'ONLYUPPERCASE123', // no lowercase
        'NoNumbers', // no numbers
      ];

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+label@domain.com',
        'user123@subdomain.domain.org',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@.com',
        'user@domain.',
        'user name@domain.com',
        'user@domain..com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
});
