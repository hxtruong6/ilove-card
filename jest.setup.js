// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { prisma } from './src/lib/prisma';

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data
  // await prisma.user.deleteMany();
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}));

// Mock fetch
global.fetch = jest.fn();
